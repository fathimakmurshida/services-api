const express = require("express");
const router = express.Router();
const auth = require("../controller/auth");
const controller = require("../controller/controller");
const paymentpath = require("../controller/paymenthelper");
const multer = require("multer");
const fileupload = require("../model/fileupload");

const Userfilestore = require("../model/userfilestore");
const Adminfilestore = require("../model/adminfiles");

const multerr = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger 5mb
  },
});
const { Storage } = require("@google-cloud/storage");


let projectId = "arclif-services-backend"; // to be defined
let keyFilename = "mykey.json"; // to be defined
const storagee = new Storage({
  projectId,
  keyFilename,
});
const bucket = storagee.bucket("arclif-services"); // to be defined

router.get("/uploadfile",async(req,res) => {
    try {
        const [files] = await bucket.getFiles();
        res.send([files]);
        console.log("Success");
      } catch (error) {
        res.send("Error:" + error);
      } 
});


router.post("/uploadfile", multerr.single("file"), async (req, res) => {
  

  try {
    //const myFile = req.file
    //const imageUrl = await uploadImage(myFile)
    console.log("made it /uploadfile");
    if (req.file) {
      console.log("file upload trying to upload");
      const blob = bucket.file(req.file.originalname);
      console.log(blob)
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        // const publicUrl = format(
        //     `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        //   )
        //   resolve(publicUrl) 
        res.status(200).send("success")
        // json({
        //     message: "Upload was successful",
        //     data: imageUrl
        // })
        console.log("success");
      });
      blobStream.end(req.file.buffer);
    } else throw "error with image ";


  } catch (err) {
    res.status(500).send(err);
  }
});


router.post("/filedataupload/:id", (req, res) => {
    try {
      console.log(req.body);
      console.log("id : ", req.params.id);
      const data = {
        login_id: req.params.id, 
        filename: req.body.filename,
      };
      const userfilestoredata = Userfilestore(data);
      userfilestoredata.save().then((response) => {
        res.status(200).json({ msg: "file added", details: response });
      });
    } catch (err) {
      res.send(err);
    }
  });


router.post("/sendOTP", auth.login);
router.post("/verifyOTP", auth.verifyOTP);
router.post("/home", auth.authenticateUser, auth.home);
router.post("/refresh", auth.refresh);
router.get("/logout", auth.logout);

//create plan
router.post("/createplan", controller.createPlan);
router.get("/viewplan", controller.viewplan);
router.get("/viewsingleplan/:id", controller.viewplanbyid);
router.put("/updateplan/:id", controller.updateplan);

//create adon services
router.post("/createadonservices", controller.createadonservices);
router.get("/viewadonservices", controller.viewadonservices);
router.put("/updateadonservices/:id", controller.updateadonservices);
router.delete("/deleteadonservices/:id", controller.deleteAdonServiceData);

//create user
router.post("/createuser", controller.createuser);
router.get("/viewuser", controller.viewuser);
router.put("/updateuser/:id", controller.updateuser);
router.get("/viewsingleuser/:id", controller.viewsingleuser);

//create and view requiremntslist
router.post("/setrequirementslist", controller.setRequirementsList);
router.post("/getrequirementslist", controller.getRequirementsList);

//choose plan by user
router.post("/chooseplan", controller.choosePlan);
//get user choos plan
router.post("/getuserplan", controller.getuserplan);

router.post("/choosesingleplan", controller.chooseSinglePlan);
router.post("/chooseAdon", controller.chooseAdon);
router.post("/getuserAdon", controller.getuseradon);

//add building details for user
router.post("/addbuildingdetails", controller.addBuildingDetails);
//get building details for user
router.post("/getbuildingdetails", controller.getBuildingDetails);

router.post("/paymentorder", paymentpath.paymentOrder);
router.post("/verifyPayment/:id", paymentpath.paymentVerify);
router.post("/isPaymentcompleted", controller.ispaymentcompleted);

router.get("/pay", (req, res) => {
  res.render("index");
});

// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, "./assets/images");
//   },
//   filename: function (req, file, callback) {
//     console.log(req.body.name);
//     callback(null, req.body.name);
//   },
// });
// var upload = multer({ storage: storage });

// router.post("/upload", upload.single("file"), (req, res) => {
//   try {
//     return res.json("file uploaded..");
//   } catch (err) {
//     res.send(err);
//   }
// });
// router.post("/filedataupload/:id", (req, res) => {
//   try {
//     console.log(req.body);
//     console.log("id : ", req.params.id);
//     const data = {
//       login_id: req.params.id,

//       filename: req.body.filename,
//     };
//     const userfilestoredata = Userfilestore(data);
//     userfilestoredata.save().then((response) => {
//       res.status(200).json({ msg: "file added", details: response });
//     });
//   } catch (err) {
//     res.send(err);
//   }
// });
router.post("/getfiles/:id", (req, res) => {
  try {
    if (req.params.id) {
      Userfilestore.find({ login_id: req.params.id }).then((response) => {
        res.send({ msg: "added file data", response: response });
      });
    } else {
      res.send({ msg: "error : id required !!" });
    }
  } catch (err) {
    res.send(err);
  }
});
router.post("/getfilesfromadmin", (req, res) => {
  try {
    if (req.body.id) {
      Adminfilestore.findOne({ login_id: req.body.id }).then((response) => {
        res.send({ msg: "added admin file data", response: response });
      });
    } else {
      res.send({ msg: "error : id required !!" });
    }
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
