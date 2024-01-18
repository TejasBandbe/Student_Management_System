import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';
import { createurl, log } from '../env';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [students, setStudents] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [regno, setRegno] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [branch, setBranch] = useState('');
  const [admyear, setAdmyear] = useState('');
  const [curyear, setCuryear] = useState('');
  const [mobno, setMobno] = useState('');
  const [fbranch, setFbranch] = useState('');
  const [fgender, setFgender] = useState('');
  const [fyear, setFyear] = useState('');

  const [currentPage, setCurrrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);

  useEffect(() => {
    const getAllStudents = () =>{
      const url = createurl('');
      axios.get(url)
      .then(res =>{
        setStudents(res.data);
      })
      .catch(error => {
        log(error);
      });
    };
    getAllStudents();
  },[]);

  const getOriginalSufFix = (number) => {
    if(number === 1){
      return `${number}st`;
    }
    else if(number === 2){
      return `${number}nd`
    }
    else if(number === 3){
      return `${number}rd`
    }
    else {
      return `${number}th`
    }
  };

  const reqFieldsValidation = () => {
    if(name === '' || regno === '' || dob === '' || gender === '' || branch === '' ||
    admyear === '' || curyear === '' || mobno === '') {
      toast.error("Please fill all the required fields");
    }
    else{
      return true;
    }
  };

  const regnoValidation = () => {
    const regex = /^[A-Z]-\d{2}-\d{4}$/;
    if(!regno.match(regex)) {
      toast.error("Please fill valid register number");
    }
    else{
      return true;
    }
  };

  const mobValidation = () => {
    const regex = /^\d{10}$/;
    if(!mobno.match(regex)) {
      toast.error("Please enter valid 10 digit mobile number");
    }
    else{
      return true;
    }
  };

  const addStudent = () => {
    if(reqFieldsValidation() && regnoValidation() && mobValidation()){
      const url = createurl('');
      axios.post(url, {
        name, 
        regno, 
        dob, 
        gender, 
        branch, 
        "admission_year" : admyear, 
        "year" : curyear, 
        mobno,
      })
      .then(res => {
        log(res.data);
        toast.success(res.data.message);
        setTimeout(function() {
          window.location.reload();
        }, 1500);
      })
      .catch(error => {
        log(error);
      });
    };
  };

  const getData = (id) => {
    const url = createurl(`/${id}`);
    axios.get(url)
    .then(res => {
      log(res.data);
      setId(res.data[0].id);
      setName(res.data[0].name);
      setRegno(res.data[0].regno);
      const dobdate = new Date(res.data[0].dob);
      var year = dobdate.getFullYear();
      var month = String(dobdate.getMonth() + 1).padStart(2, '0');
      var day = String(dobdate.getDate()).padStart(2, '0');
      const newDob = `${year}-${month}-${day}`;
      setDob(newDob);
      setGender(res.data[0].gender);
      setBranch(res.data[0].branch);
      const admdate = new Date(res.data[0].dob);
      var year = admdate.getFullYear();
      var month = String(admdate.getMonth() + 1).padStart(2, '0');
      var day = String(admdate.getDate()).padStart(2, '0');
      const newAdmDate = `${year}-${month}-${day}`;
      setAdmyear(newAdmDate);
      setCuryear(res.data[0].year);
      setMobno(res.data[0].mobno);
    })
    .catch(error => {
      log(error);
    });
  };

  const updateStudent = (id) => {
    if(reqFieldsValidation() && regnoValidation() && mobValidation()){
      const url = createurl(`/${id}`);
      axios.put(url, {
        name, 
        regno, 
        dob, 
        gender, 
        branch, 
        "admission_year" : admyear, 
        "year" : curyear, 
        mobno,
      })
      .then(res => {
        log(res.data);
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.reload();
        },1500)
      })
      .catch(error => {
        log(error);
      });
    }
  };

  const deleteStudent = (id) => {
    const url = createurl(`/${id}`);
    axios.delete(url)
    .then(res => {
      log(res.data);
      toast.success(res.data.message);
      setTimeout(() => {
        window.location.reload();
      },1500);
    })
    .catch(error => {
      log(error);
    });
  };

  const filteredStudents = students.filter((student) => {
    const selYear = fyear !== '' ? Number(fyear) : '';

    return(
    (fbranch === '' || student.branch === fbranch) && 
    (fgender === '' || student.gender === fgender) &&
    (fyear=== '' || student.year === selYear)
    );
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const pageNumbers = [];

  for(let i = 1; i <= Math.ceil(filteredStudents.length / studentsPerPage); i++){
    pageNumbers.push(i);
  }

const paginate = (pageNumber) => {
  setCurrrentPage(pageNumber);
};

const prevPage = () => {
  if(currentPage !== 1){
    setCurrrentPage(currentPage - 1);
  }
  return;
};

const nextPage = () => {
  if(currentPage !== Math.ceil(filteredStudents.length / studentsPerPage)){
    setCurrrentPage(currentPage + 1);
  }
};

  return (<>

{/* ============================================================================================ */}
{/* Add Student Modal */}
<div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="addModalLabel">Add a Student</h1>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Name</label>
          </div>
          <div className="col-lg-9">
            <input type="text" placeholder='Enter Name' className='form-control' id='name' 
            required onChange={(e)=>setName(e.target.value)}/>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Reg. No.</label>
          </div>
          <div className="col-lg-9">
            <input type="text" placeholder='Enter Reg. No.' className='form-control' id='regno' 
            required maxLength={9} onChange={(e)=>setRegno(e.target.value)}/>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">DOB</label>
          </div>
          <div className="col-lg-9">
            <input type="date" className='form-control date' id='dob' required
            onChange={(e)=>setDob(e.target.value)}/>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Gender</label>
          </div>
          <div className="col-lg-9">
          <select className="form-select" id='gender' aria-label="Default select example"
          onChange={(e)=>setGender(e.target.value)}>
            <option value="">--select gender--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Branch</label>
          </div>
          <div className="col-lg-9">
            <select className="form-select" id='branch' aria-label="Default select example"
            onChange={(e)=>setBranch(e.target.value)}>
              <option value="">--select branch--</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Electronics">Electronics</option>
              <option value="Chemical">Chemical</option>
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
            </select>          
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Admission Year</label>
          </div>
          <div className="col-lg-9">
            <input type="date" className='form-control date' id='add-year' required
            onChange={(e)=>setAdmyear(e.target.value)}/>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Current Year</label>
          </div>
          <div className="col-lg-9">
            <select className="form-select" id='year' aria-label="Default select example"
            onChange={(e)=>setCuryear(e.target.value)}>
              <option value="">--select year--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>          
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Mobile No.</label>
          </div>
          <div className="col-lg-9">
            <input type="text" className='form-control' id='mobno' required 
            maxLength={10} minLength={10} placeholder='mobile no.' 
            onChange={(e)=>setMobno(e.target.value)}/>
          </div>
        </div>
       
      </div>
      <div className="modal-footer">
        <button type="submit" className="btn btn-success" data-bs-toggle="modal" 
        data-bs-target="#addModal" onClick={addStudent}>Submit</button>     
         {/* we are not passing any value to reqFieldsValidation 
         if we want to pass values - onClick={(..values..) => {reqFieldsValidation(..values..)}}  */}
      </div>
    </div>
  </div>
</div>

{/* ====================================================================================== */}


{/* ============================================================================================ */}
{/* Edit Student Modal */}
<div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="editModalLabel">Update</h1>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Name</label>
          </div>
          <div className="col-lg-9">
            <input type="text" placeholder='Enter Name' className='form-control' id='name' 
            required value={name} onChange={(e)=>setName(e.target.value)}/>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Reg. No.</label>
          </div>
          <div className="col-lg-9">
            <input type="text" placeholder='Enter Reg. No.' className='form-control' id='regno' 
            required value={regno} maxLength={9} onChange={(e)=>setRegno(e.target.value)}/>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">DOB</label>
          </div>
          <div className="col-lg-9">
            <input type="date" className='form-control date' id='dob' required value={dob}
            onChange={(e)=>setDob(e.target.value)}/>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Gender</label>
          </div>
          <div className="col-lg-9">
          <select className="form-select" id='gender' aria-label="Default select example" value={gender}
          onChange={(e)=>setGender(e.target.value)}>
            <option value="">--select gender--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Branch</label>
          </div>
          <div className="col-lg-9">
            <select className="form-select" id='branch' aria-label="Default select example" value={branch}
            onChange={(e)=>setBranch(e.target.value)}>
              <option value="">--select branch--</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Electrical">Electrical</option>
              <option value="Electronics">Electronics</option>
              <option value="Chemical">Chemical</option>
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
            </select>          
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Admission Year</label>
          </div>
          <div className="col-lg-9">
            <input type="date" className='form-control date' id='add-year' required value={admyear}
            onChange={(e)=>setAdmyear(e.target.value)}/>
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Current Year</label>
          </div>
          <div className="col-lg-9">
            <select className="form-select" id='year' aria-label="Default select example" value={curyear}
            onChange={(e)=>setCuryear(e.target.value)}>
              <option value="">--select year--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>          
          </div>
        </div>

        <div className="row my-1">
          <div className="col-lg-3">
            <label htmlFor="">Mobile No.</label>
          </div>
          <div className="col-lg-9">
            <input type="text" className='form-control' id='mobno' required value={mobno}
            maxLength={10} minLength={10} placeholder='mobile no.' 
            onChange={(e)=>setMobno(e.target.value)}/>
          </div>
        </div>
       
      </div>
      <div className="modal-footer">
        <button type="submit" className="btn btn-success" data-bs-toggle="modal" 
        data-bs-target="#editModal" onClick={() => {updateStudent(id)}}>Save Changes</button>     
         {/* we are not passing any value to reqFieldsValidation 
         if we want to pass values - onClick={(..values..) => {reqFieldsValidation(..values..)}}  */}
      </div>
    </div>
  </div>
</div>

{/* ====================================================================================== */}

{/* ======================================================================================================= */}
{/* delete student modal */}
<div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="deleteModalLabel">Are you sure ?</h1>
        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#deleteModal"
        onClick={()=>{deleteStudent(id)}}>Yes</button>
        <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">No</button>
      </div>
    </div>
  </div>
</div>
{/* =================================================================================================== */}

    <div className='home-container' id="home-container">
        <div className="top-section">
            <button className='btn btn-success'
            data-bs-toggle="modal" data-bs-target="#addModal">
                Add Student
            </button>
            <div className="count">
              No. of students : {filteredStudents.length}
            </div>
        </div>

        <div className="filter-div">
          <div className="filter-box">
          <h4>Choose filters</h4>
            <select name="" id="" onChange={(e)=>setFbranch(e.target.value)}>
              <option className='small-text' value="">--select branch--</option>
              <option className='small-text' value="Mechanical">Mechanical</option>
              <option className='small-text' value="Electrical">Electrical</option>
              <option className='small-text' value="Electronics">Electronics</option>
              <option className='small-text' value="Chemical">Chemical</option>
              <option className='small-text' value="IT">IT</option>
              <option className='small-text' value="CSE">CSE</option>
            </select>

            <select name="" id="" onChange={(e)=>setFgender(e.target.value)}>
              <option value="">--select gender--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select name="" id="" onChange={(e)=>setFyear(e.target.value)}>
              <option value="">--select year--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
        </div>
    
          {
            filteredStudents.length === 0 ? 
              (
                <div className='not-found'>
                  <div className="message">
                  Students not found
                  </div>
                </div>
              ) : (
                <div className="body">
                  {
              currentStudents.map((student) => (
                
                <div className="student-card" key={student.id}>
                  <h4>{student.name}</h4>
                  <p>Reg.No. : {student.regno}</p>
                  <p>DOB : {new Date(student.dob).toLocaleDateString('en-GB')}</p>
                  <p>Gender : {student.gender}</p>
                  <p>Branch : {student.branch}</p>
                  <p>Admission Year : {new Date(student.admission_year).getFullYear()}</p>
                  <p>Current year : {getOriginalSufFix(student.year)}</p>
                  <p>Mobile : {student.mobno}</p>
                  <div className="buttons">
                    <i className='fa fa-pen' onClick={() => {getData(student.id)}} data-bs-toggle="modal" 
                          data-bs-target="#editModal"></i>
                    <i className='fa fa-trash' onClick={() => {getData(student.id)}} data-bs-toggle="modal" 
                          data-bs-target="#deleteModal"></i>
                  </div>
                </div>
              ))
                  }
              </div>
            )
          }
    </div>

    {
      filteredStudents.length === 0 ? (
        <></>
      ) : (
        <div className="pages">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" onClick={prevPage} aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>

            {
              pageNumbers.map(number => (
                number === currentPage ? (
                  <li className='page-item active' key={number}>
                    <a className='page-link' onClick={() => paginate(number)}>{number}</a>
                  </li> ) : (
                  <li className='page-item' key={number}>
                    <a className='page-link' onClick={() => paginate(number)}>{number}</a>
                  </li>
                )
              ))
            }
            
            <li class="page-item">
              <a class="page-link" onClick={nextPage} aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
      </nav>
    </div>
      )
    }

        </>
  )
}

export default Home
