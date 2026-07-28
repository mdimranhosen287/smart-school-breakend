# School Management System: Employee Leave Management System

This document outlines a fully functional, production-ready Laravel migration schema and controller implementation for managing teacher and staff leave applications, processing approvals, and dynamically tracking leave balances.

---

## 1. Database Schema Design (Migrations)

To build a robust leave management system, we need two tables:
1. `leave_balances`: Tracks different types of leave allocated to each employee for a specific year (e.g., Casual Leave, Sick Leave, Earned Leave).
2. `leave_applications`: Stores individual leave requests, their date ranges, reasons, and approval statuses.

### Table A: Leave Balances Table
File: `database/migrations/xxxx_xx_xx_xxxxxx_create_leave_balances_table.php`

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
        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id'); // Foreign key link to employees/teachers table
            $table->string('employee_type'); // 'Teacher' or 'Staff'
            $table->string('leave_type'); // 'Casual', 'Sick', 'Maternity', 'Earned', etc.
            $table->integer('allocated_days'); // Total days allowed for the calendar year
            $table->integer('used_days')->default(0); // Total days already consumed
            $table->integer('year'); // Calendar Year (e.g., 2026)
            $table->timestamps();

            // Prevent duplicate allocation rules for same employee, same year and leave type
            $table->unique(['employee_id', 'employee_type', 'leave_type', 'year'], 'emp_leave_year_unique');
            
            $table->index(['employee_id', 'employee_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
    }
};
```

### Table B: Leave Applications Table
File: `database/migrations/xxxx_xx_xx_xxxxxx_create_leave_applications_table.php`

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
        Schema::create('leave_applications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id');
            $table->string('employee_type'); // 'Teacher' or 'Staff'
            $table->string('leave_type'); // Matches 'leave_type' from leave_balances
            
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('total_days'); // Calculated automatically: (end_date - start_date) + 1
            
            $table->text('reason')->nullable();
            
            // Approval Status
            $table->enum('status', ['Pending', 'Approved', 'Rejected'])->default('Pending');
            
            // Management / Approver Information
            $table->unsignedBigInteger('approved_by')->nullable(); // Admin ID who approved/rejected
            $table->text('admin_remarks')->nullable(); // Feedback message when approving/rejecting
            $table->timestamp('action_taken_at')->nullable();
            
            $table->timestamps();

            $table->index(['employee_id', 'employee_type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_applications');
    }
};
```

---

## 2. Laravel API Controller
File: `app/Http/Controllers/EmployeeLeaveController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\LeaveApplication;
use App\Models\LeaveBalance;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EmployeeLeaveController extends Controller
{
    /**
     * Submit a new Leave Application
     * 
     * POST /api/leave/apply
     */
    public function apply(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|integer',
            'employee_type' => 'required|string|in:Teacher,Staff',
            'leave_type' => 'required|string',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $employeeId = $request->input('employee_id');
        $employeeType = $request->input('employee_type');
        $leaveType = $request->input('leave_type');
        $startDate = Carbon::parse($request->input('start_date'));
        $endDate = Carbon::parse($request->input('end_date'));
        $year = $startDate->year;

        // Calculate requested total days
        $totalDays = $startDate->diffInDays($endDate) + 1;

        // 1. Fetch employee's leave balance for the year
        $balance = LeaveBalance::where('employee_id', $employeeId)
            ->where('employee_type', $employeeType)
            ->where('leave_type', $leaveType)
            ->where('year', $year)
            ->first();

        if (!$balance) {
            return response()->json([
                'success' => false,
                'message' => "No leave balance allocation found for {$leaveType} in year {$year}."
            ], 404);
        }

        // 2. Check if remaining balance is sufficient
        $remainingDays = $balance->allocated_days - $balance->used_days;
        if ($totalDays > $remainingDays) {
            return response()->json([
                'success' => false,
                'message' => "Insufficient leave balance. Requested: {$totalDays} days, Available: {$remainingDays} days."
            ], 400);
        }

        // 3. Create Leave Application
        $application = new LeaveApplication();
        $application->employee_id = $employeeId;
        $application->employee_type = $employeeType;
        $application->leave_type = $leaveType;
        $application->start_date = $startDate->format('Y-m-d');
        $application->end_date = $endDate->format('Y-m-d');
        $application->total_days = $totalDays;
        $application->reason = $request->input('reason');
        $application->status = 'Pending';
        $application->save();

        return response()->json([
            'success' => true,
            'message' => 'Leave application submitted successfully and is pending approval.',
            'data' => $application
        ], 201);
    }

    /**
     * Process Leave Application (Approve or Reject)
     * 
     * POST /api/leave/process/{id}
     */
    public function process(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:Approved,Rejected',
            'admin_remarks' => 'nullable|string|max:500',
            'admin_id' => 'required|integer' // ID of the administrator taking action
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $application = LeaveApplication::find($id);

        if (!$application) {
            return response()->json([
                'success' => false,
                'message' => 'Leave application record not found.'
            ], 404);
        }

        if ($application->status !== 'Pending') {
            return response()->json([
                'success' => false,
                'message' => "This application has already been processed with status: {$application->status}."
            ], 400);
        }

        $status = $request->input('status');
        $year = Carbon::parse($application->start_date)->year;

        try {
            DB::beginTransaction();

            if ($status === 'Approved') {
                // Fetch leave balance record to update
                $balance = LeaveBalance::where('employee_id', $application->employee_id)
                    ->where('employee_type', $application->employee_type)
                    ->where('leave_type', $application->leave_type)
                    ->where('year', $year)
                    ->lockForUpdate() // Avoid race conditions in multi-admin environments
                    ->first();

                if (!$balance) {
                    throw new \Exception("Leave balance account not found for this employee.");
                }

                $remainingDays = $balance->allocated_days - $balance->used_days;
                if ($application->total_days > $remainingDays) {
                    throw new \Exception("Employee does not have sufficient remaining balance (Available: {$remainingDays} days).");
                }

                // Increment used days
                $balance->used_days += $application->total_days;
                $balance->save();
            }

            // Update application status
            $application->status = $status;
            $application->approved_by = $request->input('admin_id');
            $application->admin_remarks = $request->input('admin_remarks');
            $application->action_taken_at = Carbon::now();
            $application->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Leave application successfully {$status}.",
                'data' => $application
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error processing leave application: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get Leave balances & stats for a specific employee
     * 
     * GET /api/leave/balance
     */
    public function getBalance(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|integer',
            'employee_type' => 'required|string|in:Teacher,Staff',
            'year' => 'required|integer'
        ]);

        $balances = LeaveBalance::where('employee_id', $request->query('employee_id'))
            ->where('employee_type', $request->query('employee_type'))
            ->where('year', $request->query('year'))
            ->get()
            ->map(function ($bal) {
                return [
                    'leave_type' => $bal->leave_type,
                    'allocated_days' => $bal->allocated_days,
                    'used_days' => $bal->used_days,
                    'remaining_days' => $bal->allocated_days - $bal->used_days,
                ];
            ]);

        return response()->json([
            'success' => true,
            'year' => $request->query('year'),
            'balances' => $balances
        ]);
    }

    /**
     * List leave applications with optional filtering
     * 
     * GET /api/leave/applications
     */
    public function listApplications(Request $request)
    {
        $query = LeaveApplication::query();

        if ($request->has('employee_type')) {
            $query->where('employee_type', $request->query('employee_type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        $applications = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $applications
        ]);
    }
}
```
