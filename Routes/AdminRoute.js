const express = require("express");
const router = express.Router();
const Admin = require("../Auth/AdminAuth");
const AdminCheck = require("../Midddleware/AdminMiddleware");

router.post("/register", async (req, res) => {
  var code = await Admin.register(req.body);
  if (code._id) {
    var data = { data: code, msg: "Registration Successfully", status: true };
    return res.status(200).send(data);
  } else code == "DUPL_USER" || code == "UNKNOWN ERR" || code == "Required";
  {
    if (code == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (code == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/admin_register", AdminCheck, async (req, res) => {
  var code = await Admin.admin_register(req, res);
});

router.post("/dashboard", AdminCheck, async (req, res) => {
  const result = await Admin.dashboard(req.body);
  data = { data: result, msg: "Dashboard Data", status: true };
  return res.status(200).send(data);
});

router.post("/add_service", AdminCheck, async (req, res) => {
  //console.log(req);
  var result = await Admin.add_service(req.body);
  if (result._id) {
    if (req.body.id) var msg = "Service Update Successfully";
    else var msg = "Service Added Successfully";
    var data = {
      data: result,
      msg: msg,
      status: true,
    };
    return res.status(200).send(data);
  } else if (
    result == "DUPL_USER" ||
    result == "UNKNOWN ERR" ||
    result == "Required" ||
    result
  ) {
    if (result == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (result == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

// router.delete("/delete_patient/:id", async (req, res) => {
//   Patient.findByIdAndDelete(req.params.id).then((Patient) => {
//     if (!Patient) {
//       return res.status(404).send();
//     }
//     res.send(Patient);
//   }).catch((error) => {
//     res.status(500).send(error);
//   })
//   // if (deletedProduct) {
//   //   await deletedProduct.remove();
//   //   res.send({ message: "Product Deleted" });
//   // } else {
//   //   res.send("Error in Deletion.");
//   // }
//   // res.send("test");

// });
// router.post("/delete_patient", Admin.deletePatient);

router.post("/delete_patient", async (req, res) => {

  const deletedPatient = await Admin.deletePatient(req.body.id);
  if (deletedPatient) {

    res.send({ message: "Patient Deleted" });
  } else {
    res.send("Error in Deletion.");
  }


});


router.post("/all_patient_list", async (req, res) => {

  //console.log(req.body.nm);

  const result = await Admin.all_patient_list(req.body.id);

  // data = {
  //   data: result, msg: "Patient List", status: true
  // };
  // return res.status(200).send(data);
  // return result;
});
router.post("/add_location", AdminCheck, async (req, res) => {

  var result = await Admin.add_location(req.body);
  if (result._id) {
    if (req.body.id) var msg = "Location Update Successfully";
    else var msg = "Location Added Successfully";
    var data = {
      data: result,
      msg: msg,
      status: true,
    };
    return res.status(200).send(data);
  } else if (
    result == "DUPL_USER" ||
    result == "UNKNOWN ERR" ||
    result == "Required" ||
    result
  ) {
    if (result == "DUPL_USER") var msg = "Duplicate Location Attempt";
    else if (result == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/add_patient", AdminCheck, async (req, res) => {

  var result = await Admin.add_patient(req.body);
  if (result._id) {
    if (req.body.id) var msg = "Patient Update Successfully";
    else var msg = "Patient Added Successfully";
    var data = {
      data: result,
      msg: msg,
      status: true,
    };
    return res.status(200).send(data);
  } else if (
    result == "DUPL_USER" ||
    result == "UNKNOWN ERR" ||
    result == "Required" ||
    result
  ) {
    if (result == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (result == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/sign_in", async (req, res) => {
  var user = await Admin.signIn(req.body);
  if (user.ID) {
    var data = { data: user, msg: "Login Successfully", status: true };
    res.status(200).send(data);
  } else if (user == "PASS_ERR") {
    var data = { data: "", msg: "Please check the password", status: false };
    res.status(200).send(data);
  } else if (user == "INVALID_USR") {
    var data = { data: "", msg: "User not found", status: false };
    res.status(200).send(data);
  } else {
    var data = { data: "", msg: "Please Try Again", status: false };
    res.status(200).send(data);
  }
});

router.post("/company_register", AdminCheck, async (req, res) => {
  var code = await Admin.company_register(req.body);
  if (code._id) {
    var data = { data: code, msg: "Registration Successfully", status: true };
    return res.status(200).send(data);
  } else if (
    code == "DUPL_USER" ||
    code == "UNKNOWN ERR" ||
    code == "Required" ||
    code
  ) {
    if (code == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (code == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/company_update", AdminCheck, async (req, res) => {
  var code = await Admin.company_update(req.body);
  if (code._id) {
    var data = { data: code, msg: "Update Successfully", status: true };
    return res.status(200).send(data);
  } else if (
    code == "DUPL_USER" ||
    code == "UNKNOWN ERR" ||
    code == "Required" ||
    code
  ) {
    if (code == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (code == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/doctor_register", AdminCheck, async (req, res) => {
  var code = await Admin.doctor_register(req.body);
  if (code._id) {
    var data = { data: code, msg: "Registration Successfully", status: true };
    return res.status(200).send(data);
  } else if (
    code == "DUPL_USER" ||
    code == "UNKNOWN ERR" ||
    code == "Required" ||
    code
  ) {
    if (code == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (code == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(200).send(data);
  }
});

router.post("/doctor_update", AdminCheck, async (req, res) => {
  var code = await Admin.doctor_update(req.body);
  if (code._id) {
    var data = { data: code, msg: "Update Successfully", status: true };
    return res.status(200).send(data);
  } else if (
    code == "DUPL_USER" ||
    code == "UNKNOWN ERR" ||
    code == "Required" ||
    code
  ) {
    if (code == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (code == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(200).send(data);
  }
});

router.post("/employee_register", AdminCheck, async (req, res) => {
  var code = await Admin.employee_register(req.body);
  if (code._id) {
    var data = { data: code, msg: "Registration Successfully", status: true };
    return res.status(200).send(data);
  } else if (
    code == "DUPL_USER" ||
    code == "UNKNOWN ERR" ||
    code == "Required" ||
    code
  ) {
    if (code == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (code == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/employee_update", AdminCheck, async (req, res) => {
  var code = await Admin.employee_update(req.body);
  if (code._id) {
    var data = { data: code, msg: "Update Successfully", status: true };
    return res.status(200).send(data);
  } else if (
    code == "DUPL_USER" ||
    code == "UNKNOWN ERR" ||
    code == "Required" ||
    code
  ) {
    if (code == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (code == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/add_offer", AdminCheck, async (req, res) => {
  var code = await Admin.add_offer(req.body);
  if (code._id) {
    if (req.body.id) var msg = "Offer Update Successfully";
    else var msg = "Offer Added Successfully";
    var data = { data: code, msg: msg, status: true };
    return res.status(200).send(data);
  } else if (code == "UNKNOWN ERR" || code == "Required" || code) {
    if (code == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/company_list", AdminCheck, async (req, res) => {
  var result = await Admin.company_list(req.body);
  data = { data: result, msg: "Company List", status: true };
  return res.status(200).send(data);
});

router.post("/doctor_list", AdminCheck, async (req, res) => {
  var result = await Admin.doctor_list(req.body);
  data = { data: result, msg: "Doctor List", status: true };
  return res.status(200).send(data);
});

router.post("/employee_list", AdminCheck, async (req, res) => {
  var result = await Admin.employee_list(req.body);
  data = { data: result, msg: "Employee List", status: true };
  return res.status(200).send(data);
});

router.post("/service_list", async (req, res) => {
  var result = await Admin.service_list(req.body);
  data = { data: result, msg: "Service List", status: true };
  return res.status(200).send(data);
});


router.post("/offer_list", async (req, res) => {
  var result = await Admin.offer_list(req.body);
  data = { data: result, msg: "Offer List", status: true };
  return res.status(200).send(data);
});

router.post("/get_doctor", AdminCheck, async (req, res) => {
  var result = await Admin.get_doctor_details(req);
  data = { data: result, msg: "Doctor Details", status: true };
  return res.status(200).send(data);
});

router.post("/get_employee", AdminCheck, async (req, res) => {
  var result = await Admin.get_employee_details(req.body);
  data = { data: result, msg: "Employee Details", status: true };
  return res.status(200).send(data);
});

router.post("/get_company", AdminCheck, async (req, res) => {
  var result = await Admin.get_company_details(req.body);
  data = { data: result, msg: "Company Details", status: true };
  return res.status(200).send(data);
});

router.post("/get_offer", AdminCheck, async (req, res) => {
  var result = await Admin.get_offer_details(req.body);
  data = { data: result, msg: "Offer Details", status: true };
  return res.status(200).send(data);
});

router.post("/get_tariff", AdminCheck, async (req, res) => {
  var result = await Admin.get_tariff_details(req.body);
  data = { data: result, msg: "Tariff Details", status: true };
  return res.status(200).send(data);
});

router.post("/get_ads", AdminCheck, async (req, res) => {
  var result = await Admin.get_ads_details(req.body);
  data = { data: result, msg: "Ads Details", status: true };
  return res.status(200).send(data);
});

router.post("/get_service", AdminCheck, async (req, res) => {
  var result = await Admin.get_service_details(req.body);
  data = { data: result, msg: "Service Details", status: true };
  return res.status(200).send(data);
});

router.post("/booking_appointment", AdminCheck, async (req, res) => {
  var result = await Admin.booking_appointment(req.body);
  if (result._id) {
    var data = { data: result, msg: "Registration Successfully", status: true };
    return res.status(200).send(data);
  } else if (
    result == "DUPL_USER" ||
    result == "UNKNOWN ERR" ||
    result == "Required" ||
    result
  ) {
    if (result == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (result == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/booking_request_list", AdminCheck, async (req, res) => {
  const result = await Admin.booking_request_list(req.body);
  data = { data: result, msg: "Service List", status: true };
  return res.status(200).send(data);
});

router.post("/add_tariff", AdminCheck, async (req, res) => {
  var result = await Admin.add_tariff(req.body);
  if (result._id) {
    var data = { data: result, msg: "Registration Successfully", status: true };
    return res.status(200).send(data);
  } else if (
    result == "DUPL_USER" ||
    result == "UNKNOWN ERR" ||
    result == "Required" ||
    result
  ) {
    if (result == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (result == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/employee_bulk_upload", AdminCheck, async (req, res) => {
  var results = await Admin.employee_bulk_upload(req.body);
  var data = { data: results, msg: "Import Successfully", status: true };
  return res.status(200).send(data);
});

router.post("/add_ads", AdminCheck, async (req, res) => {
  var result = await Admin.add_ads(req.body);
  if (result._id) {
    if (req.body.id) var msg = "Update Successfully";
    else var msg = "Registration Successfully";
    var data = { data: result, msg: msg, status: true };
    return res.status(200).send(data);
  } else if (
    result == "DUPL_USER" ||
    result == "UNKNOWN ERR" ||
    result == "Required" ||
    result
  ) {
    if (result == "DUPL_USER") var msg = "Duplicate Resgistration Attempt";
    else if (result == "Required") var msg = "Please Fill Required Fields";
    else var msg = "Please Try Again!...";
    var data = { data: "", msg: msg, status: false };
    return res.status(403).send(data);
  }
});

router.post("/tariff_list", AdminCheck, async (req, res) => {
  const result = await Admin.tariff_list(req.body);
  data = { data: result, msg: "Tariff List", status: true };
  return res.status(200).send(data);
});

router.post("/get_service_doctor", AdminCheck, async (req, res) => {
  var result = await Admin.get_service_doctor(req.body);
  data = { data: result, msg: "Doctor List By Service", status: true };
  return res.status(200).send(data);
});

router.post("/ads_list", AdminCheck, async (req, res) => {
  const result = await Admin.ads_list(req.body);
  data = { data: result, msg: "Ads List", status: true };
  return res.status(200).send(data);
});

//delete_company
router.post("/company_delete", AdminCheck, async (req, res) => {
  var result = await Admin.company_delete(req.body);
  let msg,
    status = "";
  if (result != "err") {
    msg = "Company Delete Successfully";
    status = true;
  } else {
    msg = "Please Try Again!...";
    status = false;
  }
  data = { data: result, msg: msg, status: status };
  return res.status(200).send(data);
});

//employee delete
router.post("/employee_delete", AdminCheck, async (req, res) => {
  var result = await Admin.employee_delete(req.body);
  let msg,
    status = "";
  if (result != "err") {
    msg = "Employee Delete Successfully";
    status = true;
  } else {
    msg = "Please Try Again!...";
    status = false;
  }
  data = { data: result, msg: msg, status: status };
  return res.status(200).send(data);
});

//Relation delete
router.post("/relation_delete", AdminCheck, async (req, res) => {
  var result = await Admin.relation_delete(req.body);
  let msg,
    status = "";
  if (result != "err") {
    msg = "Relation Delete Successfully";
    status = true;
  } else {
    msg = "Please Try Again!...";
    status = false;
  }
  data = { data: result, msg: msg, status: status };
  return res.status(200).send(data);
});

//service delete
router.post("/service_delete", AdminCheck, async (req, res) => {
  var result = await Admin.service_delete(req.body);
  let msg,
    status = "";
  if (result != "err") {
    msg = "Service Delete Successfully";
    status = true;
  } else {
    msg = "Please Try Again!...";
    status = false;
  }
  data = { data: result, msg: msg, status: status };
  return res.status(200).send(data);
});

//doctor delete
router.post("/doctor_delete", AdminCheck, async (req, res) => {
  var result = await Admin.doctor_delete(req.body);
  let msg,
    status = "";
  if (result != "err") {
    msg = "Doctor Delete Successfully";
    status = true;
  } else {
    msg = "Please Try Again!...";
    status = false;
  }
  data = { data: result, msg: msg, status: status };
  return res.status(200).send(data);
});

//tariff delete
router.post("/tariff_delete", AdminCheck, async (req, res) => {
  var result = await Admin.tariff_delete(req.body);
  let msg,
    status = "";
  if (result != "err") {
    msg = "Tariff Delete Successfully";
    status = true;
  } else {
    msg = "Please Try Again!...";
    status = false;
  }
  data = { data: result, msg: msg, status: status };
  return res.status(200).send(data);
});

//ads delete
router.post("/ads_delete", AdminCheck, async (req, res) => {
  var result = await Admin.ads_delete(req.body);
  let msg,
    status = "";
  if (result != "err") {
    msg = "Ads Delete Successfully";
    status = true;
  } else {
    msg = "Please Try Again!...";
    status = false;
  }
  data = { data: result, msg: msg, status: status };
  return res.status(200).send(data);
});

//offer delete
router.post("/offer_delete", AdminCheck, async (req, res) => {
  var result = await Admin.offer_delete(req.body);
  let msg,
    status = "";
  if (result != "err") {
    msg = "Offer Delete Successfully";
    status = true;
  } else {
    msg = "Please Try Again!...";
    status = false;
  }
  data = { data: result, msg: msg, status: status };
  return res.status(200).send(data);
});

//deactive_doctor_list
router.post("/deactive_doctor_list", AdminCheck, async (req, res) => {
  var result = await Admin.deactive_doctor_list(req.body);
  data = { data: result, msg: "Doctor List", status: true };
  return res.status(200).send(data);
});

//deactive compayny list
router.post("/deactive_company_list", AdminCheck, async (req, res) => {
  var result = await Admin.deactive_company_list(req.body);
  data = { data: result, msg: "Company List", status: true };
  return res.status(200).send(data);
});

router.post("/deactive_employee_list", AdminCheck, async (req, res) => {
  var result = await Admin.deactive_employee_list(req.body);
  data = { data: result, msg: "Employee List", status: true };
  return res.status(200).send(data);
});

router.post("/deactive_offer_list", async (req, res) => {
  var result = await Admin.deactive_offer_list(req.body);
  data = { data: result, msg: "Offer List", status: true };
  return res.status(200).send(data);
});

router.post("/deactive_tariff_list", AdminCheck, async (req, res) => {
  const result = await Admin.deactive_tariff_list(req.body);
  data = { data: result, msg: "Tariff List", status: true };
  return res.status(200).send(data);
});

router.post("/deactive_ads_list", AdminCheck, async (req, res) => {
  const result = await Admin.deactive_ads_list(req.body);
  data = { data: result, msg: "Ads List", status: true };
  return res.status(200).send(data);
});

router.post("/deactive_service_list", async (req, res) => {
  var result = await Admin.deactive_service_list(req.body);
  data = { data: result, msg: "Service List", status: true };
  return res.status(200).send(data);
});
module.exports = router;
