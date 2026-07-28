# School Management System: Exam Term Overview & Print Management

এই ডকুমেন্টটিতে লারাভেল (Laravel)-এর **Exam Term** মডিউলের জন্য একটি পূর্ণাঙ্গ, প্রোডাকশন-রেডি সলিউশন দেওয়া হয়েছে। এখানে নির্দিষ্ট পরীক্ষার ওভারভিউ পেজ (`exam-terms.show`)-এ ক্লিক করার পর ৩টি গুরুত্বপূর্ণ প্রিন্ট ও ম্যানেজমেন্ট উইজেট (Student Exam Present Sheet, Exam Routine এবং Teacher Duty Chart) সুন্দর বুটস্ট্র্যাপ কার্ড ও প্রিন্ট-ফ্রেন্ডলি CSS (Print CSS) সহ তৈরি করা হয়েছে।

---

## ১. লারাভেল ওয়েব রাউট (Web Route)
ফাইল: `routes/web.php`

```php
<?php

use App\Http\Controllers\ExamTermController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin', 'middleware' => ['auth']], function () {
    // Exam Term Resource Routes
    Route::get('/exam-terms/{id}', [ExamTermController::class, 'show'])->name('exam-terms.show');
});
```

---

## ২. লারাভেল কন্ট্রোলার (Laravel Controller)
ফাইল: `app/Http/Controllers/ExamTermController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\ExamTerm;
use App\Models\ExamRoutine;
use App\Models\ExamDutyTeacher; // বা Teacher/Staff মডেল
use App\Models\StudentEnrollment; // বা Student/Class Enrollment মডেল
use Illuminate\Http\Request;

class ExamTermController extends Controller
{
    /**
     * Display the specified Exam Term overview with management options.
     *
     * @param int $id
     * @return \Illuminate\View\View
     */
    public function show($id)
    {
        // ১. নির্দিষ্ট এক্সাম টার্মের ডাটা নিয়ে আসা (যেমন: 'Half Yearly 2026')
        $examTerm = ExamTerm::findOrFail($id);

        // ২. পরীক্ষার রুটিন ডাটা নিয়ে আসা (সংশ্লিষ্ট ক্লাস ও ডেট অনুযায়ী সাজানো)
        $routines = ExamRoutine::where('exam_term_id', $id)
            ->orderBy('exam_date', 'asc')
            ->orderBy('start_time', 'asc')
            ->get();

        // ৩. পরীক্ষার হাজিরা শিটের জন্য ছাত্র-ছাত্রীদের তালিকা
        // এখানে উদাহরণস্বরূপ নির্দিষ্ট ক্লাসের এনরোলমেন্ট ডাটা নেওয়া হয়েছে
        $students = StudentEnrollment::where('academic_year', date('Y'))
            ->with('student') // Student রিলেশনশিপ
            ->orderBy('roll_no', 'asc')
            ->get();

        // ৪. শিক্ষকদের পরীক্ষার ডিউটি চার্ট বা ডিস্ট্রিবিউশন
        $dutyTeachers = ExamDutyTeacher::where('exam_term_id', $id)
            ->with('teacher') // Teacher/Staff রিলেশনশিপ
            ->orderBy('date', 'asc')
            ->orderBy('room_no', 'asc')
            ->get();

        // ব্লেড ভিউতে সমস্ত ডাটা পাস করা
        return view('exam-terms.show', compact('examTerm', 'routines', 'students', 'dutyTeachers'));
    }
}
```

---

## ৩. ব্লেড লেআউট ও ফ্রন্টএন্ড ভিউ (Blade View with Print CSS)
ফাইল: `resources/views/exam-terms/show.blade.php`

এই ব্লেড ফাইলে বুটস্ট্র্যাপ ৫ (Bootstrap 5) গ্রিড ও কার্ড সিস্টেম ব্যবহার করে অত্যন্ত দৃষ্টিনন্দন ইউজার ইন্টারফেস তৈরি করা হয়েছে। একই সাথে এটিতে ডেডিকেটেড প্রিন্ট-ফ্রেন্ডলি সিএসএস (`@media print`) যুক্ত করা হয়েছে যেন প্রিন্ট অপশনে ক্লিক করলে বাড়তি মেনু বা বাটন ছাড়া শুধুমাত্র প্রয়োজনীয় টেবিল বা শিটটি অত্যন্ত সুন্দরভাবে পেজে প্রিন্ট হয়।

```html
@extends('layouts.admin') {{-- আপনার এডমিন লেআউট অনুযায়ী পরিবর্তন করুন --}}

@section('content')
<div class="container-fluid py-4">
    
    <!-- Breadcrumb & Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-1">
                    <li class="breadcrumb-item"><a href="#" class="text-decoration-none">Dashboard</a></li>
                    <li class="breadcrumb-item"><a href="#" class="text-decoration-none">Exam Terms</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Overview</li>
                </ol>
            </nav>
            <h2 class="h4 font-weight-bold text-gray-900 mb-0">
                <i class="bi bi-journal-check text-success me-2"></i> {{ $examTerm->name }} - Overview & Print Hub
            </h2>
        </div>
        <a href="#" class="btn btn-outline-secondary btn-sm rounded-pill">
            <i class="bi bi-arrow-left me-1"></i> Back to List
        </a>
    </div>

    <!-- Overview Statistics Cards -->
    <div class="row g-3 mb-4">
        <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div class="d-flex align-items-center">
                    <div class="bg-success-subtle text-success p-3 rounded-4 me-3">
                        <i class="bi bi-people-fill fs-4"></i>
                    </div>
                    <div>
                        <span class="text-muted d-block text-uppercase small font-weight-bold">Total Students</span>
                        <h4 class="mb-0 font-weight-bold text-dark">{{ $students->count() }}</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div class="d-flex align-items-center">
                    <div class="bg-primary-subtle text-primary p-3 rounded-4 me-3">
                        <i class="bi bi-calendar3 fs-4"></i>
                    </div>
                    <div>
                        <span class="text-muted d-block text-uppercase small font-weight-bold">Scheduled Exams</span>
                        <h4 class="mb-0 font-weight-bold text-dark">{{ $routines->count() }} Subjects</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                <div class="d-flex align-items-center">
                    <div class="bg-warning-subtle text-warning p-3 rounded-4 me-3">
                        <i class="bi bi-person-workspace fs-4"></i>
                    </div>
                    <div>
                        <span class="text-muted d-block text-uppercase small font-weight-bold">On-Duty Teachers</span>
                        <h4 class="mb-0 font-weight-bold text-dark">{{ $dutyTeachers->unique('teacher_id')->count() }} Active</h4>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Management Hub Grid -->
    <div class="row g-4 d-print-none">
        
        <!-- ১. Student Present Sheet Card -->
        <div class="col-lg-4 col-md-6">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card">
                <div class="card-header bg-success text-white py-3 border-0 d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0 fs-6 font-weight-bold">
                        <i class="bi bi-card-checklist me-2"></i> Student Present Sheet
                    </h5>
                    <span class="badge bg-white text-success rounded-pill">Printable</span>
                </div>
                <div class="card-body d-flex flex-column justify-content-between">
                    <p class="text-muted small">
                        পরীক্ষার হলে ছাত্র-ছাত্রীদের হাজিরা ও স্বাক্ষর নেওয়ার জন্য ক্লাস অনুযায়ী রেডি-মেড এটেন্ডেন্স শিট জেনারেট এবং সরাসরি প্রিন্ট করুন।
                    </p>
                    <button onclick="printSection('printable-present-sheet')" class="btn btn-success w-full rounded-3 py-2 font-weight-bold">
                        <i class="bi bi-printer me-1"></i> Print Attendance Sheet
                    </button>
                </div>
            </div>
        </div>

        <!-- ২. Exam Routine Card -->
        <div class="col-lg-4 col-md-6">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card">
                <div class="card-header bg-primary text-white py-3 border-0 d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0 fs-6 font-weight-bold">
                        <i class="bi bi-calendar-event me-2"></i> Exam Routine Matrix
                    </h5>
                    <span class="badge bg-white text-primary rounded-pill">View & Print</span>
                </div>
                <div class="card-body d-flex flex-column justify-content-between">
                    <p class="text-muted small">
                        এই টার্মের অন্তর্ভুক্ত সকল বিষয়ের তারিখ, হল রুম এবং সময়সূচী সম্বলিত রুটিন ভিউ করুন এবং নোটিশ বোর্ডে টাঙানোর জন্য প্রিন্ট করুন।
                    </p>
                    <button onclick="printSection('printable-exam-routine')" class="btn btn-primary w-full rounded-3 py-2 font-weight-bold">
                        <i class="bi bi-printer me-1"></i> View & Print Routine
                    </button>
                </div>
            </div>
        </div>

        <!-- ৩. Teacher Distribution Chart Card -->
        <div class="col-lg-4 col-md-12">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden hover-card">
                <div class="card-header bg-warning text-dark py-3 border-0 d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0 fs-6 font-weight-bold">
                        <i class="bi bi-person-badge-fill me-2"></i> Teacher Invigilation Chart
                    </h5>
                    <span class="badge bg-dark text-warning rounded-pill">Management</span>
                </div>
                <div class="card-body d-flex flex-column justify-content-between">
                    <p class="text-muted small">
                        পরীক্ষায় শিক্ষকদের হল গার্ড বা ইনভিজিলেটর ডিউটি বন্টনের তালিকা ও তারিখ সম্বলিত ডিউটি চার্ট প্রিন্ট এবং নোটিফিকেশন ম্যানেজ করুন।
                    </p>
                    <button onclick="printSection('printable-teacher-duties')" class="btn btn-warning text-dark w-full rounded-3 py-2 font-weight-bold">
                        <i class="bi bi-printer me-1"></i> Print Invigilation Chart
                    </button>
                </div>
            </div>
        </div>
        
    </div>

    <!-- ========================================== -->
    <!--  PRINTABLE SECTIONS (HIDDEN IN STANDARD UI) -->
    <!-- ========================================== -->

    <!-- ১. Student Exam Present Sheet (হাজিরা শিট) -->
    <div id="printable-present-sheet" class="printable-content mt-5">
        <div class="print-header text-center mb-4">
            <h3 class="fw-bold m-0">Students Care Model School</h3>
            <p class="text-muted small mb-1">Adabari, Dhaka-1212</p>
            <h4 class="fw-bold text-dark border-bottom border-2 pb-2 d-inline-block">{{ $examTerm->name }} - Attendance Register</h4>
            <div class="row text-start mt-3">
                <div class="col-6"><strong>Class / Group:</strong> General Class Routine</div>
                <div class="col-6 text-end"><strong>Date:</strong> ________________________</div>
            </div>
        </div>

        <table class="table table-bordered align-middle">
            <thead>
                <tr class="table-light text-center">
                    <th style="width: 8%">Roll No</th>
                    <th style="width: 25%">Student Name</th>
                    <th style="width: 15%">Exam Roll</th>
                    <th style="width: 15%">Script Serial No</th>
                    <th style="width: 22%">Candidate Signature</th>
                    <th style="width: 15%">Remarks</th>
                </tr>
            </thead>
            <tbody>
                @forelse($students as $enroll)
                    <tr>
                        <td class="text-center fw-bold">{{ $enroll->roll_no }}</td>
                        <td>{{ $enroll->student->name ?? 'N/A' }}</td>
                        <td class="text-center text-muted">SCMS-{{ 202600 + $enroll->id }}</td>
                        <td></td>
                        <td class="signature-line"></td>
                        <td></td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="text-center text-muted">No students registered in this term.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
        
        <!-- Attendance Sheet Footer -->
        <div class="row mt-5 pt-4">
            <div class="col-6 text-start">
                <p class="border-top border-dark d-inline-block pt-1 px-3">Room Invigilator Signature</p>
            </div>
            <div class="col-6 text-end">
                <p class="border-top border-dark d-inline-block pt-1 px-3">Principal / Headmaster Signature</p>
            </div>
        </div>
    </div>


    <!-- ২. Exam Routine (পরীক্ষার রুটিন) -->
    <div id="printable-exam-routine" class="printable-content mt-5">
        <div class="print-header text-center mb-4">
            <h3 class="fw-bold m-0">Students Care Model School</h3>
            <p class="text-muted small mb-2">Adabari, Dhaka-1212</p>
            <h4 class="fw-bold text-dark border-bottom border-2 pb-2 d-inline-block">Official Written Exam Routine: {{ $examTerm->name }}</h4>
        </div>

        <table class="table table-bordered align-middle text-center">
            <thead>
                <tr class="table-dark">
                    <th style="width: 20%">Date & Day</th>
                    <th style="width: 25%">Subject Code & Title</th>
                    <th style="width: 25%">Time Schedule</th>
                    <th style="width: 15%">Duration</th>
                    <th style="width: 15%">Room Matrix</th>
                </tr>
            </thead>
            <tbody>
                @forelse($routines as $routine)
                    <tr>
                        <td class="fw-bold text-start ps-3">
                            {{ \Carbon\Carbon::parse($routine->exam_date)->format('d M Y, l') }}
                        </td>
                        <td class="text-start ps-3">{{ $routine->subject_name }}</td>
                        <td>
                            <span class="badge bg-light text-dark border p-2">
                                {{ \Carbon\Carbon::parse($routine->start_time)->format('h:i A') }} - {{ \Carbon\Carbon::parse($routine->end_time)->format('h:i A') }}
                            </span>
                        </td>
                        <td>3 Hours</td>
                        <td>Room {{ $routine->room_no }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-muted py-3">No routine scheduled yet for this term.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <div class="mt-4 p-3 bg-light rounded border border-gray-200">
            <p class="mb-0 text-muted small text-start">
                <strong>নির্দেশাবলী:</strong> ১. পরীক্ষার্থীদের পরীক্ষার ৩০ মিনিট পূর্বে অবশ্যই আসন গ্রহণ করতে হবে। ২. পরীক্ষাহলে কোনো প্রকার ইলেকট্রনিক ডিভাইস বা ব্যাগ আনা যাবে না।
            </p>
        </div>
    </div>


    <!-- ৩. Teacher Distribution Chart / Exam Duty Chart (ডিউটি চার্ট) -->
    <div id="printable-teacher-duties" class="printable-content mt-5">
        <div class="print-header text-center mb-4">
            <h3 class="fw-bold m-0">Students Care Model School</h3>
            <p class="text-muted small mb-2">Adabari, Dhaka-1212</p>
            <h4 class="fw-bold text-dark border-bottom border-2 pb-2 d-inline-block">{{ $examTerm->name }} - Teacher Invigilation Chart</h4>
        </div>

        <table class="table table-bordered align-middle">
            <thead>
                <tr class="table-warning text-dark text-center">
                    <th style="width: 20%">Date & Shift</th>
                    <th style="width: 25%">Teacher Name</th>
                    <th style="width: 20%">Assigned Designation</th>
                    <th style="width: 15%">Room No</th>
                    <th style="width: 20%">Duty Period Signature</th>
                </tr>
            </thead>
            <tbody>
                @forelse($dutyTeachers as $duty)
                    <tr>
                        <td class="fw-bold text-center">
                            {{ \Carbon\Carbon::parse($duty->date)->format('d M Y') }}
                        </td>
                        <td class="fw-bold text-dark">{{ $duty->teacher->name ?? 'N/A' }}</td>
                        <td>{{ $duty->teacher->role ?? 'Faculty Member' }}</td>
                        <td class="text-center fw-bold text-success">Room - {{ $duty->room_no }}</td>
                        <td class="signature-line"></td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center text-muted">No duty roster distributed yet.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>

        <!-- Teacher Duty Footer -->
        <div class="row mt-5 pt-4">
            <div class="col-6 text-start">
                <p class="border-top border-dark d-inline-block pt-1 px-3">Prepared By (Exam Controller)</p>
            </div>
            <div class="col-6 text-end">
                <p class="border-top border-dark d-inline-block pt-1 px-3">Approved By (Principal)</p>
            </div>
        </div>
    </div>

</div>

<!-- CSS Styling & Print Setup -->
<style>
    /* Hover effects for Dashboard Management Cards */
    .hover-card {
        transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .hover-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
    }

    /* Standard UI Layout: Hide printable contents in Web Page view */
    .printable-content {
        display: none;
    }

    /* Print-Friendly Media CSS */
    @media print {
        /* Hide all admin sidebars, navbars, cards, and buttons */
        body * {
            visibility: hidden;
        }

        /* Show only the target section during printing */
        .printable-active, .printable-active * {
            visibility: visible;
        }

        /* Adjust the target printable component position to top-left */
        .printable-active {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 10px !important;
        }

        /* Table Specific Styling for pristine print outcomes */
        table {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 11px !important;
        }

        table th, table td {
            border: 1px solid #111 !important;
            padding: 6px 8px !important;
        }

        .signature-line {
            height: 35px;
        }

        /* Remove gray background fill in tables during print and force colors */
        .table-light, .table-dark, .table-warning {
            background-color: #f8f9fa !important;
            color: #000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
    }
</style>

<!-- JS Controller for Dynamic Single-Section Printing -->
<script>
    function printSection(sectionId) {
        // ১. অন্যান্য প্রিন্ট লেআউট অবজেক্ট গুলো নিষ্ক্রিয় করুন
        const sections = document.querySelectorAll('.printable-content');
        sections.forEach(sec => sec.classList.remove('printable-active'));

        // ২. কাঙ্ক্ষিত সেকশনে প্রিন্ট ক্লাস অ্যাড করুন
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('printable-active');
            
            // ৩. ব্রাউজার প্রিন্টিং উইন্ডো ট্রিগার করুন
            window.print();
        }
    }
</script>
@endsection
```

---

## ৪. ব্যবহারের নির্দেশাবলী ও কার্যপ্রণালী

১. **রাউট ও কন্ট্রোলার কানেকশন:** ব্যবহারকারী যখন কোনো পরীক্ষার নামের পাশে থাকা "Eye Icon" (View Button)-এ ক্লিক করবেন, তখন আপনার তৈরি করা এই রাউটটি `ExamTermController@show` মেথডকে ট্রিগার করবে। 
২. **হাজিরা শিট (Student Exam Present Sheet):** এই অপশনটিতে ক্লিক করলে সংশ্লিষ্ট কোর্সের বা সমস্ত স্টুডেন্টদের নাম ও রোল নম্বর নিয়ে একটি টেবিল লোড হয়ে স্বয়ংক্রিয়ভাবে ব্রাউজারের প্রিন্টিং উইন্ডো ওপেন হবে, যেখানে ক্যান্ডিডেটদের স্বাক্ষরের ডেডিকেটেড ঘর থাকবে।
৩. **রুটিন ও ডিউটি চার্ট প্রিন্ট:** রুটিন এবং শিক্ষকদের গার্ড ডিউটির তালিকা নোটিশ বোর্ডে টানানোর জন্য একদম মার্জিন ঠিক রেখে এ৪ (A4) পেপারে নিখুঁতভাবে প্রিন্ট করার জন্য ডেডিকেটেড প্রিন্ট লেআউট সাজানো রয়েছে।
