// Talabti Backend Server
// منصة طلبتي التعليمية العراقية

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// =========================
// Database Connection
// =========================

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


// =========================
// Student Model
// =========================

const StudentSchema = new mongoose.Schema({

    phone_number:{
        type:String,
        required:true,
        unique:true
    },

    full_name:String,

    gender:{
        type:String,
        enum:["Male","Female"]
    },

    governorate:String,

    password:String,

    profile_image:String,

    stage:String,

    register_date:{
        type:Date,
        default:Date.now
    },

    status:{
        type:String,
        default:"active"
    }

});


const Student = mongoose.model("Student", StudentSchema);


// =========================
// Subject Model
// =========================

const SubjectSchema = new mongoose.Schema({

    name:String,

    stage:String,

    branch:String,

    price:{
        type:Number,
        default:10000
    },

    status:{
        type:Boolean,
        default:true
    }

});


const Subject = mongoose.model("Subject", SubjectSchema);


// =========================
// Content Model
// =========================

const ContentSchema = new mongoose.Schema({

    subject_id:String,

    year:{
        type:Number,
        min:2012,
        max:2026
    },

    type:{
        type:String,
        enum:[
            "مرشحات",
            "اسئلة وزارية",
            "حلول",
            "ملخصات",
            "فيديو",
            "PDF"
        ]
    },

    title:String,

    file:String,

    description:String

});


const Content = mongoose.model("Content", ContentSchema);


// =========================
// Subscription Model
// =========================

const SubscriptionSchema = new mongoose.Schema({

    student_id:String,

    subject_id:String,

    payment_method:{
        type:String,
        enum:[
            "رافدين",
            "رشيد",
            "زين كاش"
        ]
    },

    amount:{
        type:Number,
        default:10000
    },

    status:{
        type:String,
        default:"Pending"
    },

    date:{
        type:Date,
        default:Date.now
    }

});


const Subscription = mongoose.model(
"Subscription",
SubscriptionSchema
);


// =========================
// Student Register
// =========================

app.post("/api/register", async(req,res)=>{

try{

const student=new Student(req.body);

await student.save();

res.json({
message:"تم إنشاء الحساب بنجاح",
student
});


}catch(error){

res.status(500).json({
error:error.message
});

}

});


// =========================
// Get Subjects
// =========================

app.get("/api/subjects", async(req,res)=>{

const subjects=await Subject.find();

res.json(subjects);

});


// =========================
// Add Content
// =========================

app.post("/api/content", async(req,res)=>{

const content=new Content(req.body);

await content.save();

res.json({
message:"تم إضافة المحتوى",
content
});

});


// =========================
// Get Content By Year
// =========================

app.get("/api/content/:subject/:year",
async(req,res)=>{


const data=await Content.find({

subject_id:req.params.subject,

year:req.params.year

});


res.json(data);


});


// =========================
// Payment
// =========================

app.post("/api/payment",
async(req,res)=>{


const payment=new Subscription(req.body);

await payment.save();


res.json({

message:"تم إرسال طلب الدفع",
status:"Pending"

});


});


// =========================
// Admin Dashboard
// =========================

app.get("/api/admin/statistics",
async(req,res)=>{


const students=
await Student.countDocuments();


const subjects=
await Subject.countDocuments();


const payments=
await Subscription.countDocuments();


res.json({

students,
subjects,
payments

});


});


// =========================
// Server Start
// =========================

const PORT =
process.env.PORT || 5000;


app.listen(PORT,()=>{

console.log(
`Talabti Server Running On ${PORT}`
);

});
