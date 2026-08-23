اسم التطبيق:
طلبتي

النوع:
منصة تعليمية عراقية شاملة

المنصات:
- Android
- iOS
- Web PWA

المستخدمون:
1- الطالب
2- الأدمن الرئيسي
3- المشرفون (اختياري)
Talabti App

├── Splash Screen
├── Login/Register
├── Student Dashboard
├── Educational Sections
├── Subjects
├── Years Archive
├── Exams
├── AI Assistant
├── Payments
├── Profile
└── Notifications


Talabti Admin Panel

├── Admin Login
├── Dashboard
├── Students Management
├── Stages Management
├── Subjects Management
├── Content Management
├── Exams Management
├── Payments Management
├── AI Settings
└── App Settings
Student {
 id
 phone_number
 verification_code
 full_name
 gender
 governorate
 password
 profile_image
 register_date
 status
}
Male
Female
بغداد
نينوى
البصرة
أربيل
كربلاء
النجف
الأنبار
صلاح الدين
ديالى
واسط
ميسان
ذي قار
المثنى
القادسية
بابل
كركوك
Stages

1- السادس الإعدادي
   ├── علمي
   ├── أحيائي
   ├── تطبيقي
   ├── أدبي
   └── مهني

2- الثالث المتوسط

3- السادس الابتدائي
Subject {

id

name

stage_id

branch

price

status

created_date

}
رياضيات
السادس العلمي
السعر:
10000 IQD
Content {

id

subject_id

year

type

title

file

description

}
2012
2013
2014
2015
2016
2017
2018
2019
2020
2021
2022
2023
2024
2025
2026
- مرشحات
- أسئلة وزارية
- حلول
- ملخصات
- فيديو
- PDF
السادس العلمي
كيمياء
2026

- أهم المرشحات
- الأسئلة المتوقعة
- الحلول
Subscription {

id

student_id

subject_id

payment_method

amount

status

date

}
10000 دينار عراقي
Pending
Approved
Expired
