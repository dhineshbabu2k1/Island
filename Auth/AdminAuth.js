const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { MongooseError, mongo, Mongoose } = require("mongoose");
const {
  AdminSecret,
  ClientSecret,
  DoctorSecret,
  Secret,
} = require("../config/jwt-config");
const jwtConfig = require("../config/jwt-config");
const users = require("../models/admin");
const Admin = require("../models/admin").Admin;
const Login = require("../models/admin").Login;
const Service = require("../models/admin").Service;
const Patient = require("../models/admin").Patient;
const Location = require("../models/admin").Location;

const mongodb = require("mongodb");
const { param } = require("../Routes/AdminRoute");
const ObjectId = mongodb.ObjectId;

async function signIn(params) {
  var admin = await Login.findOne({
    $and: [{ email: params.email }, { role: params.role }, { status: 1 }],
  }).catch((err) => {
    return err;
  });
  if (admin != null) {
    if (bcrypt.compareSync(params.password, admin.password)) {
      var secret = "";
      if (admin.role == 1) secret = AdminSecret;
      else if (admin.role == 2) secret = ClientSecret;
      else if (admin.role == 3) secret = DoctorSecret;
      else secret = Secret;
      let userToken = JWT.sign(
        {
          email: admin.email,
          ID: admin.ref_id,
          role: admin.role,
          // isAdmin: true,
        },
        secret,
        { expiresIn: jwtConfig.expiresIn }
      );
      return {
        userToken: userToken,
        expiresIn: jwtConfig.expiresIn,
        ID: admin._id,
        Name: admin.name,
        Role: admin.role,
        Ref_id: admin.ref_id,
      };
    } else {
      return "PASS_ERR";
    }
  } else {
    return "INVALID_USR";
  }
}
async function dashboard() {
  var doccount = await Doctor.find({ status: 1 }).count();
  var comcount = await Company.find({ status: 1 }).count();
  var empcount = await Employee.find({ status: 1 }).count();
  const data = { doctor: doccount, company: comcount, employee: empcount };
  return data;
}
async function register(params) {
  params.password = bcrypt.hashSync(params.password, 5);
  let loginpara = {
    name: params.name,
    email: params.email,
    password: params.password,
    role: 1,
    status: 1,
  };
  let adminpara = {
    name: params.name,
    email: params.email,
    address: params.address,
    mobile_no: params.mobile_no,
    status: 1,
  };

  if (
    adminpara.name != "" &&
    adminpara.email != "" &&
    loginpara.password != ""
  ) {
    var admincnt = await Admin.find({
      email: adminpara.email,
    })
      .count()
      .catch((err) => {
        return err;
      });

    var logincnt = await Login.find({
      email: adminpara.email,
    })
      .count()
      .catch((err) => {
        return err;
      });

    if (admincnt == 0 && logincnt == 0) {
      let adminent = new Admin(adminpara);
      try {
        var add_admin = await adminent.save();
        loginpara.ref_id = add_admin._id;
        let login = new Login(loginpara);
        var result = await login.save();
      } catch (err) {
        if (err instanceof mongo.MongoError) {
          if (err.code == 11000) {
            return "DUPL_USER";
          }
        }
      }
      if (result == undefined) return "UNKNOWN ERR";
      else return add_admin;
    } else return "DUPL_USER";
  } else return "Required";
}

async function add_service(params) {
  if (params.name) {
    if (params.id) {
      try {
        const service = await Service.findById(params.id);
        if (!service) {
          return "No document found";
        }
        service.picture = params.picture;
        service.name = params.name;
        const updatedService = await service.save();
        return updatedService;
      } catch (err) {
        return "err";
      }
    } else {
      params.status = 1;
      const service_ent = new Service(params);
      var service_cnt = await Service.find({
        name: params.name,
      })
        .count()
        .catch((err) => {
          return err;
        });
      if (service_cnt == 0) {
        try {
          var result = await service_ent.save();
        } catch (err) {
          if (err instanceof mongo.MongoError) {
            if (err.code == 11000) {
              return "DUPL_USER";
            }
          }
        }
        if (result == undefined) return "UNKNOWN ERR";
        else return result;
      } else return "DUPL_USER";
    }
  } else return "Required";
}


async function add_patient(params) {
  if (params.nm) {
    if (params.id) {
      try {
        const service = await Patient.findById(params.id);
        if (!service) {
          return "No document found";
        }

        service.nm = params.nm;
        const updatedService = await service.save();
        return updatedService;
      } catch (err) {
        return "err";
      }
    } else {
      params.status = 1;

      const service_ent = new Patient(params);
      var service_cnt = await Patient.find({
        nm: params.nm,
      })
        .count()
        .catch((err) => {

          return err;
        });


      if (service_cnt == 0) {
        try {

          var result = await service_ent.save();
        } catch (err) {
          if (err instanceof mongo.MongoError) {
            console.log(err.code)
            if (err.code == 11000) {
              return "DUPL_USER";
            }
          }
        }
        if (result == undefined) return "UNKNOWN ERR";
        else return result;
      } else return "DUPL_USER";
    }
  } else return "Required";
}


async function add_location(params) {
  if (params.location_name) {
    if (params.id) {
      try {
        const location = await Location.findById(params.id);
        if (!location) {
          return "No document found";
        }

        location.location_name = params.location_name;
        location.updated_at = new Date();

        const updatedlocation = await location.save();
        return updatedlocation;
      } catch (err) {
        return "err";
      }
    } else {
      params.created_at = new Date();
      params.active_status = 1;
      params.updated_at = null;
      const location_ent = new Location(params);
      var location_cnt = await Location.find({
        location_name: params.location_name,
      })
        .count()
        .catch((err) => {

          return err;
        });


      if (location_cnt == 0) {
        try {

          var result = await location_ent.save();
        } catch (err) {
          if (err instanceof mongo.MongoError) {
            console.log(err.code)
            if (err.code == 11000) {
              return "DUPL_USER";
            }
          }
        }
        if (result == undefined) return "UNKNOWN ERR";
        else return result;
      } else return "DUPL_USER";
    }
  } else return "Required";
}



async function company_register(params) {
  let loginpara = {
    name: params.company_name,
    email: params.email,
    role: 2,
    status: 1,
  };
  let companypara = {
    company_name: params.company_name,
    email: params.email,
    company_type: params.company_type,
    mobile: params.mobile,
    address: params.address,
    no_of_emp: params.no_of_emp,
    contact_person: params.contact_person,
    picture: params.picture,
    status: 1,
  };

  if (
    companypara.company_name != "" &&
    companypara.email != "" &&
    companypara.company_type != "" &&
    companypara.mobile != "" &&
    companypara.address != "" &&
    companypara.no_of_emp != "" &&
    companypara.contact_person != "" &&
    companypara.picture != "" &&
    params.password != ""
  ) {
    var compnaycnt = await Company.find({
      email: companypara.email,
    })
      .count()
      .catch((err) => {
        return err;
      });

    var logincnt = await Login.find({
      email: companypara.email,
    })
      .count()
      .catch((err) => {
        return err;
      });

    if (compnaycnt == 0 && logincnt == 0) {
      let companyent = new Company(companypara);
      try {
        var add_company = await companyent.save();
        loginpara.ref_id = add_company._id;
        params.password = bcrypt.hashSync(params.password, 5);
        loginpara.password = params.password;
        let login = new Login(loginpara);
        var result = await login.save();
      } catch (err) {
        if (err instanceof mongo.MongoError) {
          if (err.code == 11000) {
            return "DUPL_USER";
          }
        }
      }
      if (result == undefined) return "UNKNOWN ERR";
      else return add_company;
    } else return "DUPL_USER";
  } else return "Required";
}

async function company_update(params) {
  if (params.id) {
    if (
      params.company_name != "" &&
      params.email != "" &&
      params.company_type != "" &&
      params.mobile != "" &&
      params.address != "" &&
      params.no_of_emp != "" &&
      params.contact_person != "" &&
      params.picture != ""
    ) {
      try {
        const company_para = await Company.findById(params.id);
        if (!company_para) {
          return "No document found";
        }
        company_para.company_name = params.company_name;
        company_para.email = params.email;
        company_para.company_type = params.company_type;
        company_para.mobile = params.mobile;
        company_para.address = params.address;
        company_para.no_of_emp = params.no_of_emp;
        company_para.contact_person = params.contact_person;
        if (params.picture) company_para.picture = params.picture;
        else company_para.picture = "";

        const updatedCompany = await company_para.save();
        return updatedCompany;
      } catch (err) {
        if (err instanceof mongo.MongoError) {
          if (err.code == 11000) {
            return "DUPL_USER";
          }
        }
        return "err";
      }
    } else return "Required";
  } else return "err";
}

async function doctor_register(params) {
  let loginpara = {
    name: params.name,
    email: params.email,
    role: 3,
    status: 1,
  };
  let doctor_para = {
    name: params.name,
    email: params.email,
    age: params.age,
    mobile: params.mobile,
    gender: params.gender,
    experience: params.experience,
    qualification: params.qualification,
    mode_of_consultant: params.mode_of_consultant,
    available_time: params.available_time,
    clinic_name: params.clinic_name,
    clinic_address: params.clinic_address,
    aboutus: params.aboutus,
    status: 1,
  };

  if (params.picture) doctor_para.picture = params.picture;
  else doctor_para.picture = "";
  if (
    doctor_para.name != "" &&
    doctor_para.picture != "" &&
    doctor_para.age != "" &&
    doctor_para.gender != "" &&
    doctor_para.clinic_address != "" &&
    doctor_para.mode_of_consultant != "" &&
    doctor_para.mobile != "" &&
    doctor_para.email != "" &&
    doctor_para.qualification != "" &&
    doctor_para.available_time != "" &&
    doctor_para.clinic_name != "" &&
    params.password != ""
  ) {
    var promises = [];
    promises.push(Doctor.find({ email: doctor_para.email }).count());
    promises.push(Login.find({ email: doctor_para.email }).count());
    var checkexiting_email = await Promise.all(promises);
    if (checkexiting_email[0] == 0 && checkexiting_email[1] == 0) {
      let doctor_ent = new Doctor(doctor_para);
      try {
        var add_doctor = await doctor_ent.save();
        loginpara.ref_id = add_doctor._id;
        params.password = bcrypt.hashSync(params.password, 5);
        loginpara.password = params.password;
        let login = new Login(loginpara);
        var result = await login.save();
      } catch (err) {
        if (err instanceof mongo.MongoError) {
          if (err.code == 11000) {
            return "DUPL_USER";
          }
        }
      }
      if (result == undefined) return "UNKNOWN ERR";
      else return add_doctor;
    } else return "DUPL_USER";
  } else return "Required";
}

async function doctor_update(params) {
  if (params.id) {
    if (
      params.name != "" &&
      params.picture != "" &&
      params.age != "" &&
      params.gender != "" &&
      params.clinic_address != "" &&
      params.mode_of_consultant != "" &&
      params.mobile != "" &&
      params.email != "" &&
      params.qualification != "" &&
      params.available_time != "" &&
      params.clinic_name != ""
    ) {
      try {
        const doctor_para = await Doctor.findById(params.id);
        if (!doctor_para) {
          return "No document found";
        }
        doctor_para.name = params.name;
        doctor_para.email = params.email;
        doctor_para.age = params.age;
        doctor_para.mobile = params.mobile;
        doctor_para.gender = params.gender;
        doctor_para.experience = params.experience;
        doctor_para.qualification = params.qualification;
        doctor_para.mode_of_consultant = params.mode_of_consultant;
        doctor_para.available_time = params.available_time;
        doctor_para.clinic_name = params.clinic_name;
        doctor_para.clinic_address = params.clinic_address;
        doctor_para.aboutus = params.aboutus;
        if (params.picture) doctor_para.picture = params.picture;
        else doctor_para.picture = "";

        const updatedDoctor = await doctor_para.save();
        return updatedDoctor;
      } catch (err) {
        if (err instanceof mongo.MongoError) {
          if (err.code == 11000) {
            return "DUPL_USER";
          }
        }
        return "err";
      }
    } else return "Required";
  } else return "err";
}

async function employee_register(params) {
  let loginpara = {
    name: params.name,
    email: params.email,
    role: 4,
    status: 1,
  };
  let family = [];
  if (params.family_details) family = params.family_details;
  let emp_para = {
    name: params.name,
    email: params.email,
    age: params.age,
    mobile: params.mobile,
    gender: params.gender,
    employee_id: params.employee_id,
    address: params.address,
    job_role: params.job_role,
    company_name: params.company_name,
    marital_status: params.marital_status,
    picture: params.picture,
    family_picture: params.family_picture,
    status: 1,
  };

  if (
    emp_para.name != "" &&
    emp_para.email != "" &&
    emp_para.employee_id != "" &&
    emp_para.company_name != "" &&
    params.password != ""
  ) {
    var emp_cnt = await Employee.find({
      email: emp_para.email,
    })
      .count()
      .catch((err) => {
        return err;
      });

    var logincnt = await Login.find({
      email: emp_para.email,
    })
      .count()
      .catch((err) => {
        return err;
      });

    if (emp_cnt == 0 && logincnt == 0) {
      let emp_ent = new Employee(emp_para);
      try {
        var add_emp = await emp_ent.save();
        loginpara.ref_id = add_emp._id;
        let familypara = { employee_id: add_emp._id, status: 1 };
        family.forEach(async (val) => {
          familypara.relation_name = val.relation_name;
          familypara.relationship = val.relationship;
          familypara.relation_age = val.relation_age;
          let family_entry = new Family(familypara);
          let ds = await family_entry.save();
        });
        params.password = bcrypt.hashSync(params.password, 5);
        loginpara.password = params.password;
        let login = new Login(loginpara);
        var result = await login.save();
      } catch (err) {
        if (err instanceof mongo.MongoError) {
          if (err.code == 11000) {
            return "DUPL_USER";
          }
        }
      }
      if (result == undefined) return "UNKNOWN ERR";
      else return add_emp;
    } else return "DUPL_USER";
  } else return "Required";
}

async function employee_update(params) {
  if (params.id) {
    if (
      params.name != "" &&
      params.email != "" &&
      params.employee_id != "" &&
      params.company_name != ""
    ) {
      try {
        const emp_para = await Employee.findById(params.id);
        if (!emp_para) {
          return "No document found";
        }
        let family = [];
        if (params.family_details) family = params.family_details;
        emp_para.name = params.name;
        emp_para.email = params.email;
        emp_para.age = params.age;
        emp_para.mobile = params.mobile;
        emp_para.gender = params.gender;
        emp_para.employee_id = params.employee_id;
        emp_para.address = params.address;
        emp_para.job_role = params.job_role;
        emp_para.company_name = params.company_name;
        emp_para.marital_status = params.marital_status;
        if (params.picture) emp_para.picture = params.picture;
        else emp_para.picture = "";
        if (params.family_picture)
          emp_para.family_picture = params.family_picture;
        else emp_para.family_picture = "";

        const updatedEmployee = await emp_para.save();
        let familypara = { employee_id: params.id, status: 1 };
        family.forEach(async (val) => {
          if (val._id) familypara = await Family.findById(val._id);
          familypara.relation_name = val.relation_name;
          familypara.relationship = val.relationship;
          familypara.relation_age = val.relation_age;
          let family_entry = new Family(familypara);
          let ds = await family_entry.save();
        });
        return updatedEmployee;
      } catch (err) {
        if (err instanceof mongo.MongoError) {
          if (err.code == 11000) {
            return "DUPL_USER";
          }
        }
        return "err";
      }
    } else return "Required";
  } else return "err";
}

async function add_offer(params) {
  if (
    params.title != "" &&
    params.amount != "" &&
    params.picture &&
    params.date != ""
  ) {
    if (params.id) {
      try {
        const offer = await Offer.findById(params.id);
        if (!offer) {
          return "No document found";
        }
        offer.title = params.title;
        offer.amount = params.amount;
        offer.description = params.description;
        offer.picture = params.picture;
        offer.date = params.date;
        const updatedOffer = await offer.save();
        return updatedOffer;
      } catch (err) {
        return "err";
      }
    } else {
      let offerpara = {
        title: params.title,
        amount: params.amount,
        description: params.description,
        picture: params.picture,
        date: params.date,
        status: 1,
      };
      let offer_ent = new Offer(offerpara);
      try {
        var result = await offer_ent.save();
      } catch {
        return "UNKNOWN ERR";
      }
      if (result == undefined) return "UNKNOWN ERR";
      else return result;
    }
  } else return "Required";
}

async function add_tariff(params) {
  if (
    params.investigation != "" &&
    params.category != "" &&
    params.rate != "" &&
    params.final_rate != "" &&
    params.type != ""
  ) {
    if (params.id) {
      try {
        const tariff = await Tariff.findById(params.id);
        if (!tariff) {
          return "No document found";
        }
        tariff.investigation = params.investigation;
        tariff.category = params.category;
        tariff.rate = params.rate;
        tariff.final_rate = params.final_rate;
        tariff.type = params.type;
        const updatedTariff = await tariff.save();
        return updatedTariff;
      } catch (err) {
        return "err";
      }
    } else {
      let offerpara = {
        investigation: params.investigation,
        category: params.category,
        rate: params.rate,
        final_rate: params.final_rate,
        type: params.type,
        status: 1,
      };
      let tariff_ent = new Tariff(offerpara);
      try {
        var result = await tariff_ent.save();
      } catch {
        return "UNKNOWN ERR";
      }
      if (result == undefined) return "UNKNOWN ERR";
      else return result;
    }
  } else return "Required";
}

async function add_ads(params) {
  if (params.picture != "" && params.date) {
    if (params.id) {
      try {
        const ads = await Ads.findById(params.id);
        if (!ads) {
          return "No document found";
        }
        ads.picture = params.picture;
        ads.date = params.date;
        const updatedAds = await ads.save();
        return updatedAds;
      } catch (err) {
        return "err";
      }
    } else {
      let adspara = {
        picture: params.picture,
        date: params.date,
        status: 1,
      };
      let adsentry = new Ads(adspara);
      try {
        var result = await adsentry.save();
      } catch {
        return "UNKNOWN ERR";
      }
      if (result == undefined) return "UNKNOWN ERR";
      else return result;
    }
  } else return "Required";
}

async function employee_bulk_upload(params) {
  var company_id = params.company_name;
  var employee_list = params.employees;
  employee_list.forEach(async (row) => {
    let emp_data = {
      name: row.name,
      email: row.email,
      age: row.age,
      gender: row.gender,
      company_name: company_id,
      employee_id: row.employee_id,
      job_role: row.job_role,
      mobile: row.mobile,
      marital_status: row.marital_status,
      address: row.address,
      status: 1,
    };

    let employee_ent = new Employee(emp_data);
    var res = await employee_ent.save();
    var no_of_family = row.no_of_family_members;
    let family = [];
    for (let i = 1; i <= no_of_family; i++) {
      family = {
        employee_id: res._id,
        status: 1,
        relation_name: row["name_" + i],
        relationship: row["relationship_" + i],
        relation_age: row["age_" + i],
      };
      var family_ent = new Family(family);
      await family_ent.save();
    }
  });
  return employee_list;
}

async function tariff_list(param) {
  var traiff_list = await Tariff.find({
    $and: [{ status: { $eq: 1 } }, { type: { $eq: param.type } }],
  }).catch((err) => {
    return err;
  });
  return traiff_list;
}

async function ads_list(param) {
  var currentdate = new Date();
  var ads_list = await Ads.find({
    $and: [{ status: 1 }, { date: { $gte: currentdate } }],
  }).catch((err) => {
    return err;
  });
  return ads_list;
}

async function company_list(param) {
  var company_list = await Company.find({ status: 1 }).catch((err) => {
    return err;
  });
  return company_list;
}

async function doctor_list(params) {
  if (params.mode) {
    var doctor_list = await Doctor.find({
      $and: [
        { status: 1 },
        {
          mode_of_consultant: { $all: [params.mode] },
        },
      ],
    }).catch((err) => {
      return err;
    });
    return doctor_list;
  } else {
    var doctor_list = await Doctor.find({ status: 1 }).catch((err) => {
      return err;
    });
    return doctor_list;
  }
}

async function decodeClientToken(token) {
  return JWT.verify(token, jwtConfig.ClientSecret, (err, decoded) => {
    return decoded;
  });
}
async function employee_list(token) {
  var dsc = await decodeClientToken(token);
  if (dsc) {
    var employee_list = await Employee.aggregate([
      {
        $match: {
          company_name: ObjectId(dsc.ID),
          status: 1,
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company_name",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          picture: "$picture",
          mobile: "$mobile",
          age: "$age",
          employee_id: "$employee_id",
          company_name: "$company.company_name",
        },
      },
    ]).catch((err) => {
      return err;
    });
  } else {
    var employee_list = await Employee.aggregate([
      {
        $match: { status: 1 },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company_name",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          picture: "$picture",
          mobile: "$mobile",
          age: "$age",
          employee_id: "$employee_id",
          company_name: "$company.company_name",
        },
      },
    ]).catch((err) => {
      return err;
    });
  }
  return employee_list;
}

async function decodeAdminToken(token) {
  return JWT.verify(
    token.headers["authorization"],
    jwtConfig.AdminSecret,
    (err, decoded) => {
      return decoded;
    }
  );
}

async function get_doctor_details(params) {
  var dsc = await decodeAdminToken(params);
  var doctor = await Doctor.findOne({ _id: ObjectId(params.body.id) }).catch(
    (err) => {
      return err;
    }
  );
  if (dsc) {
  } else {
    var promises = [];
    doctor.mode_of_consultant.forEach((row) => {
      promises.push(Service.findOne({ _id: ObjectId(row) }));
    });
    var services = await Promise.all(promises);
    if (doctor.mode_of_consultant instanceof Array) {
      datas = doctor.mode_of_consultant.map((result, i) => {
        if (services[i]) doctor.mode_of_consultant[i] = services[i].name;
      });
    }
  }
  return doctor;
}

async function get_company_details(params) {
  var company = await Company.findOne({ _id: ObjectId(params.id) }).catch(
    (err) => {
      return err;
    }
  );
  return company;
}

async function get_employee_details(params) {
  var employee = await Employee.aggregate([
    {
      $match: {
        _id: ObjectId(params.id),
      },
    },
    {
      $project: {
        _id: "$_id",
        name: "$name",
        email: "$email",
        age: "$age",
        mobile: "$mobile",
        gender: "$gender",
        employee_id: "$employee_id",
        address: "$address",
        job_role: "$job_role",
        company_name: "$company_name",
        marital_status: "$marital_status",
        picture: "$picture",
        family_picture: "$family_picture",
        employee_id: "$employee_id",
        family_details: "",
      },
    },
  ]).catch((err) => {
    return err;
  });
  if (employee) {
    var family = await Family.find({
      $and: [{ employee_id: ObjectId(params.id) }, { status: 1 }],
    })
      .then((res) => {
        employee[0].family_details = res;
      })
      .catch((err) => {
        return true;
      });
  }
  if (employee) employee = employee[0];
  return employee;
}

async function get_offer_details(params) {
  var offer = await Offer.findOne({ _id: ObjectId(params.id) }).catch((err) => {
    return err;
  });
  return offer;
}

async function get_tariff_details(params) {
  var tariff = await Tariff.findOne({ _id: ObjectId(params.id) }).catch(
    (err) => {
      return err;
    }
  );
  return tariff;
}

async function get_ads_details(params) {
  var ads = await Ads.findOne({ _id: ObjectId(params.id) }).catch((err) => {
    return err;
  });
  return ads;
}
async function get_service_details(params) {
  var service = await Service.findOne({ _id: ObjectId(params.id) }).catch(
    (err) => {
      return err;
    }
  );
  return service;
}

async function get_service_doctor(params) {
  var doctors = await Doctor.find({
    mode_of_consultant: { $all: [params.id] },
  }).catch((err) => {
    return err;
  });
  return doctors;
}

async function booking_appointment(params) {
  let booking_para = {
    employee_id: params._id,
    service_id: params.service_id,
    doctor_id: params.doctor_id,
    date: params.date,
    appointment_for: params.appointment_for,
    description: params.description,
    status: 1,
  };

  if (
    booking_para.employee_id != "" &&
    booking_para.service_id != "" &&
    booking_para.doctor_id != "" &&
    booking_para.date != ""
  ) {
    if (booking_para.appointment_for == 2 && params.family_id == "")
      return "UNKNOWN ERR";
    if (booking_para.appointment_for == 2)
      booking_para.family_id = params.family_id;
    else booking_para.family_id = params._id;
    let booking_entry = new Booking(booking_para);
    try {
      console.log(booking_entry);
      var booking_res = await booking_entry.save();
    } catch (err) {
      if (err instanceof mongo.MongoError) {
        if (err.code == 11000) {
          return "DUPL_USER";
        }
      }
      console.log(err);
    }
    console.log(booking_res);
    if (booking_res == undefined) return "UNKNOWN ERR";
    else return booking_res;
  } else return "Required";
}

async function service_list(params) {
  const service = await Service.find({ status: 1 }).catch((err) => {
    return err;
  });
  return service;
}

async function deletePatient(id) {
  deletePatient = await Patient.findByIdAndDelete(id).catch((err) => {
    return err;
  })
  return deletePatient;
}
// async function deletePatient(patientID) {
//   patient = await Patient.findByIdAndDelete(patientID).catch((err) => {
//     return err;
//   });
//   return patient;
// }

async function all_patient_list(patientID) {
  const service = await Patient.find({ status: 1 }).catch((err) => {
    return err;
  });
  // var service_cnt = await Patient.find({
  //   status: params.status,
  // })

  //   .catch((err) => {

  //     return err;
  //   });

  return service;
}

async function offer_list(params) {
  const offer = await Offer.find({ status: 1 }).catch((err) => {
    return err;
  });
  return offer;
}

async function decodeDoctorToken(token) {
  return JWT.verify(token, jwtConfig.DoctorSecret, (err, decoded) => {
    return decoded;
  });
}

async function booking_request_list(token) {
  var dsc = await decodeDoctorToken(token);
  let results = [];
  if (dsc) {
    results = await Booking.aggregate([
      {
        $match: {
          doctor_id: ObjectId(dsc.ID),
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctor_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$employee" },
      { $unwind: "$doctor" },
      { $unwind: "$service" },
      {
        $project: {
          _id: 0,
          emp_ename: "$employee.name",
          mobile: "$mobile",
          service: "$service.name",
          company: "$employee.company_name",
          doctor: "$doctor.name",
          date: "$date",
        },
      },
    ]).catch((err) => {
      return err;
    });
  } else {
    results = await Booking.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employee_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctor_id",
          foreignField: "_id",
          as: "doctor",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$employee" },
      { $unwind: "$doctor" },
      { $unwind: "$service" },
      {
        $project: {
          _id: 0,
          emp_ename: "$employee.name",
          mobile: "$mobile",
          service: "$service.name",
          company: "$employee.company_name",
          doctor: "$doctor.name",
          date: "$date",
        },
      },
    ]).catch((err) => {
      return err;
    });
  }
  let datas = [];

  var promises = [];

  results.forEach((row) => {
    promises.push(Company.findOne({ _id: ObjectId(row.company) }));
  });
  var companies = await Promise.all(promises);
  if (results instanceof Array) {
    datas = results.map((result, i) => {
      var companyname = "";
      if (companies[i]) companyname = companies[i].company_name;
      return {
        emp_ename: result.emp_ename,
        company: companyname,
        date: result.date,
        doctor: result.doctor,
        service: result.service,
      };
    });
  }
  return datas;
}

async function company_delete(params) {
  await Company.findById(params.id, (err, user) => {
    if (err) return "err";
    user.status = params.status; // Update the 'age' property of the document
    user.save((err, updatedCompany) => {
      if (err) return "err";
      else return updatedCompany;
    });
  });
}

async function employee_delete(params) {
  await Employee.findById(params.id, (err, user) => {
    if (err) return "err";
    user.status = params.status; // Update the 'age' property of the document
    user.save((err, updatedEmployee) => {
      if (err) return "err";
      else return updatedEmployee;
    });
  });
}
async function relation_delete(params) {
  await Family.findById(params.id, (err, user) => {
    if (err) return "err";
    user.status = params.status; // Update the 'age' property of the document
    user.save((err, updatedFamily) => {
      if (err) return "err";
      else return updatedFamily;
    });
  });
}

async function service_delete(params) {
  await Service.findById(params.id, (err, user) => {
    if (err) return "err";
    user.status = params.status; // Update the 'age' property of the document
    user.save((err, updatedService) => {
      if (err) return "err";
      else return updatedService;
    });
  });
}

async function doctor_delete(params) {
  await Doctor.findById(params.id, (err, user) => {
    if (err) return "err";
    user.status = params.status; // Update the 'age' property of the document
    user.save((err, updatedDoctor) => {
      if (err) return "err";
      else return updatedDoctor;
    });
  });
}

async function tariff_delete(params) {
  await Tariff.findById(params.id, (err, user) => {
    if (err) return "err";
    user.status = params.status; // Update the 'age' property of the document
    user.save((err, updatedTariff) => {
      if (err) return "err";
      else return updatedTariff;
    });
  });
}

async function ads_delete(params) {
  await Ads.findById(params.id, (err, user) => {
    if (err) return "err";
    user.status = params.status; // Update the 'age' property of the document
    user.save((err, updatedAds) => {
      if (err) return "err";
      else return updatedAds;
    });
  });
}

async function offer_delete(params) {
  await Offer.findById(params.id, (err, user) => {
    if (err) return "err";
    user.status = params.status; // Update the 'age' property of the document
    user.save((err, updatedOffer) => {
      if (err) return "err";
      else return updatedOffer;
    });
  });
}

async function deactive_doctor_list(params) {
  var doctor_list = await Doctor.find({ status: 2 }).catch((err) => {
    return err;
  });
  return doctor_list;
}

async function deactive_company_list(param) {
  var company_list = await Company.find({ status: 2 }).catch((err) => {
    return err;
  });
  return company_list;
}

async function deactive_employee_list(token) {
  var dsc = await decodeClientToken(token);
  if (dsc) {
    var employee_list = await Employee.aggregate([
      {
        $match: {
          company_name: ObjectId(dsc.ID),
          status: 2,
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company_name",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          picture: "$picture",
          mobile: "$mobile",
          age: "$age",
          employee_id: "$employee_id",
          company_name: "$company.company_name",
        },
      },
    ]).catch((err) => {
      return err;
    });
  } else {
    var employee_list = await Employee.aggregate([
      {
        $match: { status: 2 },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company_name",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: "$company" },
      {
        $project: {
          _id: "$_id",
          name: "$name",
          picture: "$picture",
          mobile: "$mobile",
          age: "$age",
          employee_id: "$employee_id",
          company_name: "$company.company_name",
        },
      },
    ]).catch((err) => {
      return err;
    });
  }
  return employee_list;
}

async function deactive_offer_list(params) {
  const offer = await Offer.find({ status: 2 }).catch((err) => {
    return err;
  });
  return offer;
}

async function deactive_tariff_list(param) {
  var traiff_list = await Tariff.find({ status: 2 }).catch((err) => {
    return err;
  });
  return traiff_list;
}

async function deactive_ads_list(param) {
  var ads_list = await Ads.find({ status: 2 }).catch((err) => {
    return err;
  });
  return ads_list;
}

async function deactive_service_list(params) {
  const service = await Service.find({ status: 2 }).catch((err) => {
    return err;
  });
  return service;
}

// exports.deletePatient = (req, res) => {

//   Patient.findByIdAndRemove(req.body.id)
//     .then(result => {
//       res.send("Success3");
//     })
//     .catch(err => console.log(err));
// }

module.exports.deletePatient = deletePatient;
module.exports.signIn = signIn;
module.exports.dashboard = dashboard;
module.exports.register = register;
module.exports.add_service = add_service;
module.exports.add_patient = add_patient;
module.exports.add_location = add_location;
module.exports.company_register = company_register;
module.exports.doctor_register = doctor_register;
module.exports.employee_register = employee_register;
module.exports.company_list = company_list;
module.exports.doctor_list = doctor_list;
module.exports.employee_list = employee_list;
module.exports.service_list = service_list;
module.exports.all_patient_list = all_patient_list;
module.exports.offer_list = offer_list;
module.exports.get_doctor_details = get_doctor_details;
module.exports.get_employee_details = get_employee_details;
module.exports.get_company_details = get_company_details;
module.exports.get_offer_details = get_offer_details;
module.exports.get_tariff_details = get_tariff_details;
module.exports.get_ads_details = get_ads_details;
module.exports.get_service_details = get_service_details;
module.exports.get_service_doctor = get_service_doctor;
module.exports.booking_appointment = booking_appointment;
module.exports.booking_request_list = booking_request_list;
module.exports.add_offer = add_offer;
module.exports.add_tariff = add_tariff;
module.exports.tariff_list = tariff_list;
module.exports.add_ads = add_ads;
module.exports.ads_list = ads_list;
module.exports.employee_bulk_upload = employee_bulk_upload;
module.exports.company_delete = company_delete;
module.exports.employee_delete = employee_delete;
module.exports.relation_delete = relation_delete;
module.exports.service_delete = service_delete;
module.exports.doctor_delete = doctor_delete;
module.exports.tariff_delete = tariff_delete;
module.exports.ads_delete = ads_delete;
module.exports.offer_delete = offer_delete;
module.exports.deactive_doctor_list = deactive_doctor_list;
module.exports.deactive_company_list = deactive_company_list;
module.exports.deactive_employee_list = deactive_employee_list;
module.exports.deactive_offer_list = deactive_offer_list;
module.exports.deactive_tariff_list = deactive_tariff_list;
module.exports.deactive_ads_list = deactive_ads_list;
module.exports.deactive_service_list = deactive_service_list;
module.exports.doctor_update = doctor_update;
module.exports.employee_update = employee_update;
module.exports.company_update = company_update;
