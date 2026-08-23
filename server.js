const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// اتصال قاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Database Connected");
})
.catch((error)=>{
    console.log("Database Error:", error.message);
});


// =======================
// Models
// =======================


const Student = mongoose.model(
"Student",
new mongoose.Schema({

phone_number:{
type:String,
unique:true
},

full_name:String,

gender:String,

governorate:String,

password:String,

stage:String,

profile_image:String,

status:{
type:String,
default:"active"
},

created:{
type:Date,
default:Date.now
}

})
);



const Subject = mongoose.model(
"Subject",
new mongoose.Schema({

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

})
);



const Content = mongoose.model(
"Content",
new mongoose.Schema({

subject_id:String,

year:Number,

type:String,

title:String,

file:String,

description:String

})
);



const Subscription = mongoose.model(
"Subscription",
new mongoose.Schema({

student_id:String,

subject_id:String,

payment_method:String,

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

})
);



// =======================
// Home
// =======================

app.get("/",(req,res)=>{

res.json({

app:"Talabti",
message:"طلبتي Backend Working"

});

});



// =======================
// Register Student
// =======================

app.post("/api/register",async(req,res)=>{

try{

const student=new Student(req.body);

await student.save();


res.json({

success:true,

message:"تم تسجيل الطالب",

student

});


}catch(error){

res.status(500).json({

error:error.message

});

}

});




// =======================
// Get Students
// =======================

app.get("/api/students",
async(req,res)=>{

const data=await Student.find();

res.json(data);

});




// =======================
// Subjects
// =======================

app.post("/api/subjects",
async(req,res)=>{

const subject=new Subject(req.body);

await subject.save();


res.json({

message:"تم إضافة المادة",

subject

});

});



app.get("/api/subjects",
async(req,res)=>{

const subjects=
await Subject.find();

res.json(subjects);

});




// =======================
// Content 2012-2026
// =======================


app.post("/api/content",
async(req,res)=>{


const content=
new Content(req.body);


await content.save();


res.json({

message:"تم إضافة المحتوى",

content

});


});




app.get(
"/api/content/:subject/:year",
async(req,res)=>{


const result=
await Content.find({

subject_id:req.params.subject,

year:req.params.year

});


res.json(result);


});




// =======================
// Payments
// =======================


app.post("/api/payment",
async(req,res)=>{


const payment=
new Subscription(req.body);


await payment.save();


res.json({

message:"تم إرسال الدفع",

status:"Pending"

});


});





// =======================
// Admin Statistics
// =======================


app.get("/api/admin",
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




// مهم لـ Vercel
module.exports = app;
