# School Management System: Admission Merit & Waiting List Management

This document provides a complete, production-ready Laravel migration schema and controller implementation for managing applicant exam scores, dynamically generating **Merit Lists** and **Waiting Lists**, and promoting candidates.

---

## 1. Database Migration Schema
File: `database/migrations/xxxx_xx_xx_xxxxxx_create_admission_applications_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('admission_applications', function (Blueprint $table) {
            $table->id();
            $table->string('application_no')->unique(); // Unique application tracking number
            $table->string('applicant_name');
            $table->string('exam_roll_no')->unique()->nullable(); // Roll number assigned for admission test
            $table->string('requested_class'); // Target class (e.g., '6', '9')
            $table->string('group_name')->default('General'); // Science, Commerce, Humanities, or General
            
            // Exam Marks Specification
            $table->decimal('admission_test_score', 5, 2)->nullable(); // Score out of 100 (e.g., 85.50)
            $table->integer('merit_position')->nullable(); // Calculated position in merit sequence
            
            // Candidate Status Selection
            // - Pending: Applied but exam score not processed / list not generated yet
            // - Merit: Qualified within the available seat capacity
            // - Waiting: Placed in queue based on capacity limits
            // - Approved: Formally admitted into the school
            // - Rejected: Did not qualify
            $table->enum('status', ['Pending', 'Merit', 'Waiting', 'Approved', 'Rejected'])->default('Pending');
            
            // Guardian & Basic Details
            $table->string('guardian_name');
            $table->string('guardian_phone');
            $table->string('birth_registration_no')->nullable();
            
            $table->text('remarks')->nullable();
            $table->timestamps();

            // Indexing for rapid queries during list generation
            $table->index(['requested_class', 'status']);
            $table->index(['requested_class', 'admission_test_score']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admission_applications');
    }
};
```

---

## 2. Laravel API Controller
File: `app/Http/Controllers/AdmissionMeritListController.php`

```php
<?php

namespace App\Http/Controllers;

use App\Models\AdmissionApplication; // Assuming you have generated this model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class AdmissionMeritListController extends Controller
{
    /**
     * Generate Merit and Waiting Lists for a specific class based on test scores.
     * 
     * POST /api/admission/generate-list
     */
    public function generateList(Request $request)
    {
        // Validate payload parameters
        $validator = Validator::make($request->all(), [
            'class' => 'required|string',
            'merit_seats' => 'required|integer|min:1',
            'waiting_seats' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $class = $request->input('class');
        $meritSeats = (int) $request->input('merit_seats');
        $waitingSeats = (int) $request->input('waiting_seats');

        // Fetch all candidates for the given class who have appeared for the exam
        // Ordered by score descending, secondary order by application ID (first-come, first-served on ties)
        $applicants = AdmissionApplication::where('requested_class', $class)
            ->whereNotNull('admission_test_score')
            ->orderBy('admission_test_score', 'desc')
            ->orderBy('id', 'asc')
            ->get();

        if ($applicants->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No applicants found with recorded exam scores for Class ' . $class
            ], 404);
        }

        try {
            // Execute in a secure database transaction
            DB::beginTransaction();

            $position = 1;
            foreach ($applicants as $applicant) {
                $applicant->merit_position = $position;

                if ($position <= $meritSeats) {
                    // Fits within Merit Quota
                    $applicant->status = 'Merit';
                } elseif ($position <= ($meritSeats + $waitingSeats)) {
                    // Fits within Waiting Quota
                    $applicant->status = 'Waiting';
                } else {
                    // Out of capacity limit
                    $applicant->status = 'Rejected';
                }

                $applicant->save();
                $position++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully generated Merit and Waiting Lists for Class {$class}.",
                'total_processed' => $applicants->count(),
                'merit_count' => min($meritSeats, $applicants->count()),
                'waiting_count' => max(0, min($waitingSeats, $applicants->count() - $meritSeats))
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while generating lists: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Retrieve the generated Merit List for a specific class.
     * 
     * GET /api/admission/merit-list
     */
    public function getMeritList(Request $request)
    {
        $request->validate([
            'class' => 'required|string'
        ]);

        $class = $request->query('class');

        $meritList = AdmissionApplication::where('requested_class', $class)
            ->where('status', 'Merit')
            ->orderBy('merit_position', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'class' => $class,
            'count' => $meritList->count(),
            'data' => $meritList
        ]);
    }

    /**
     * Retrieve the generated Waiting List for a specific class.
     * 
     * GET /api/admission/waiting-list
     */
    public function getWaitingList(Request $request)
    {
        $request->validate([
            'class' => 'required|string'
        ]);

        $class = $request->query('class');

        $waitingList = AdmissionApplication::where('requested_class', $class)
            ->where('status', 'Waiting')
            ->orderBy('merit_position', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'class' => $class,
            'count' => $waitingList->count(),
            'data' => $waitingList
        ]);
    }

    /**
     * Promote the top candidate from the Waiting List to the Merit List.
     * Useful when a merit seat becomes vacant because a candidate declined admission.
     * 
     * POST /api/admission/promote-waiting/{id}
     */
    public function promoteFromWaiting(Request $request, $id)
    {
        // Find the specific application to vacate/cancel (Merit applicant who canceled)
        $canceledApplicant = AdmissionApplication::find($id);

        if (!$canceledApplicant) {
            return response()->json([
                'success' => false,
                'message' => 'Merit applicant record not found.'
            ], 404);
        }

        if ($canceledApplicant->status !== 'Merit') {
            return response()->json([
                'success' => false,
                'message' => 'Only candidates currently in the Merit List can be replaced.'
            ], 400);
        }

        $class = $canceledApplicant->requested_class;

        // Find the top-most Waiting list candidate for this class
        $nextCandidate = AdmissionApplication::where('requested_class', $class)
            ->where('status', 'Waiting')
            ->orderBy('merit_position', 'asc')
            ->first();

        if (!$nextCandidate) {
            return response()->json([
                'success' => false,
                'message' => 'No waiting list candidates available for Class ' . $class
            ], 404);
        }

        try {
            DB::beginTransaction();

            // 1. Vacate the canceled candidate
            $canceledApplicant->status = 'Rejected';
            $canceledApplicant->remarks = 'Admission offer declined/canceled. Seat vacated.';
            $canceledApplicant->save();

            // 2. Promote the next waiting candidate
            $nextCandidate->status = 'Merit';
            $nextCandidate->remarks = "Promoted from waiting list to replace Application ID: {$canceledApplicant->application_no}";
            $nextCandidate->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully promoted {$nextCandidate->applicant_name} to the Merit List.",
                'vacated_applicant' => $canceledApplicant->applicant_name,
                'promoted_applicant' => $nextCandidate->applicant_name
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error processing promotion: ' . $e->getMessage()
            ], 500);
        }
    }
}
```
