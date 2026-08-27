/* =========================================================
   MISSION DIGITAL DETECTIVE
   INDEX LOGIN SYSTEM
   SUPABASE VERSION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const studentTab =
      document.getElementById(
        "studentTab"
      );


    const teacherTab =
      document.getElementById(
        "teacherTab"
      );


    const studentForm =
      document.getElementById(
        "studentForm"
      );


    const teacherForm =
      document.getElementById(
        "teacherForm"
      );


    const classroomSelect =
      document.getElementById(
        "classroom"
      );


    const studentIdInput =
      document.getElementById(
        "studentId"
      );


    const studentPasswordInput =
      document.getElementById(
        "studentPassword"
      );


    const studentPasswordToggle =
      document.getElementById(
        "studentPasswordToggle"
      );


    const teacherPasswordInput =
      document.getElementById(
        "teacherPassword"
      );


    const teacherPasswordToggle =
      document.getElementById(
        "teacherPasswordToggle"
      );


    const loginMessage =
      document.getElementById(
        "loginMessage"
      );


    const studentLoginButton =
      document.getElementById(
        "studentLoginButton"
      );


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(
      text,
      type = "error"
    ) {


      if (!loginMessage) {
        return;
      }


      if (!text) {

        loginMessage.textContent =
          "";


        loginMessage.classList.add(
          "hidden"
        );


        return;

      }


      loginMessage.textContent =
        text;


      loginMessage.classList.remove(
        "hidden"
      );


      if (
        type === "success"
      ) {

        loginMessage.style.color =
          "#2cff8c";

      }

      else {

        loginMessage.style.color =
          "#ff759e";

      }

    }


    /* =====================================================
       ROLE TABS
    ===================================================== */

    if (
      studentTab &&
      teacherTab &&
      studentForm &&
      teacherForm
    ) {


      studentTab.addEventListener(
        "click",
        function () {


          studentTab.classList.add(
            "active"
          );


          teacherTab.classList.remove(
            "active"
          );


          studentForm.classList.remove(
            "hidden"
          );


          teacherForm.classList.add(
            "hidden"
          );


          showMessage("");

        }
      );


      teacherTab.addEventListener(
        "click",
        function () {


          teacherTab.classList.add(
            "active"
          );


          studentTab.classList.remove(
            "active"
          );


          teacherForm.classList.remove(
            "hidden"
          );


          studentForm.classList.add(
            "hidden"
          );


          showMessage("");

        }
      );

    }


    /* =====================================================
       PASSWORD TOGGLE
    ===================================================== */

    function setupPasswordToggle(
      input,
      button
    ) {


      if (
        !input ||
        !button
      ) {

        return;

      }


      button.addEventListener(
        "click",
        function () {


          if (
            input.type ===
            "password"
          ) {

            input.type =
              "text";


            button.textContent =
              "◎";

          }

          else {

            input.type =
              "password";


            button.textContent =
              "◉";

          }

        }
      );

    }


    setupPasswordToggle(
      studentPasswordInput,
      studentPasswordToggle
    );


    setupPasswordToggle(
      teacherPasswordInput,
      teacherPasswordToggle
    );


/* =====================================================
   LOAD CLASSROOMS
===================================================== */

async function loadClassrooms() {

  classroomSelect.disabled =
    true;


  classroomSelect.innerHTML =
    `
      <option value="">
        กำลังโหลดห้องเรียน...
      </option>
    `;


  try {

    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "get_classrooms"
      );


    if (error) {

      throw error;

    }


    console.log(
      "Classroom data:",
      data
    );


    if (
      !data
      ||
      data.length === 0
    ) {

      classroomSelect.innerHTML =
        `
          <option value="">
            ไม่พบข้อมูลห้องเรียน
          </option>
        `;

      return;

    }


    /* =================================================
       ดึงชื่อห้อง
    ================================================= */

    let classrooms =
      data
        .map(
          function (item) {

            return item.class_name;

          }
        )
        .filter(Boolean);


    /* =================================================
       ลบข้อมูลซ้ำ
    ================================================= */

    classrooms =
      [
        ...new Set(
          classrooms
        )
      ];


    /* =================================================
       เรียงเลขห้อง
       ม.2/3 → ม.2/4 → ม.2/10
    ================================================= */

    classrooms.sort(
      function (a, b) {

        const roomA =
          Number(
            String(a)
              .split("/")[1]
          );


        const roomB =
          Number(
            String(b)
              .split("/")[1]
          );


        return roomA - roomB;

      }
    );


    /* =================================================
       OPTION เริ่มต้น
    ================================================= */

    classroomSelect.innerHTML =
      `
        <option value="">
          เลือกห้องเรียน
        </option>
      `;


    /* =================================================
       ADD CLASSROOMS
    ================================================= */

    classrooms.forEach(
      function (className) {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          className;


        option.textContent =
          className;


        classroomSelect.appendChild(
          option
        );

      }
    );


    /* =================================================
       ENABLE
    ================================================= */

    classroomSelect.disabled =
      false;


    console.log(
      "Classrooms loaded:",
      classrooms
    );

  }

  catch (error) {

    console.error(
      "Load classrooms error:",
      error
    );


    classroomSelect.innerHTML =
      `
        <option value="">
          โหลดห้องเรียนไม่สำเร็จ
        </option>
      `;


    classroomSelect.disabled =
      true;


    showMessage(
      "ไม่สามารถเชื่อมต่อฐานข้อมูลห้องเรียนได้"
    );

  }

}

    /* =====================================================
       STUDENT LOGIN
    ===================================================== */

    async function studentLogin(
      event
    ) {


      event.preventDefault();


      showMessage("");


      const classroom =
        classroomSelect
          .value
          .trim();


      const studentId =
        studentIdInput
          .value
          .trim();


      const password =
        studentPasswordInput
          .value
          .trim();


      /* ===================================================
         VALIDATION
      =================================================== */

      if (!classroom) {

        showMessage(
          "กรุณาเลือกห้องเรียน"
        );


        classroomSelect.focus();


        return;

      }


      if (!studentId) {

        showMessage(
          "กรุณากรอกรหัสนักเรียน"
        );


        studentIdInput.focus();


        return;

      }


      if (!password) {

        showMessage(
          "กรุณากรอกรหัสผ่าน"
        );


        studentPasswordInput.focus();


        return;

      }


      /* ===================================================
         LOADING
      =================================================== */

      const oldButtonHTML =
        studentLoginButton
          ?
          studentLoginButton.innerHTML
          :
          "";


      if (
        studentLoginButton
      ) {

        studentLoginButton.disabled =
          true;


        studentLoginButton.innerHTML =
          `

            <span>
              VERIFYING...
            </span>

            <strong>
              ◌
            </strong>

          `;

      }


      try {


        /* =================================================
           SUPABASE LOGIN
        ================================================= */

        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "student_login",
            {

              p_class_name:
                classroom,

              p_student_id:
                studentId,

              p_password:
                password

            }
          );


        if (error) {

          throw error;

        }


        /* =================================================
           INVALID
        ================================================= */

        if (
          !data ||
          data.length === 0
        ) {


          showMessage(
            "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบห้องเรียน รหัสนักเรียน และรหัสผ่าน"
          );


          studentPasswordInput.value =
            "";


          studentPasswordInput.focus();


          return;

        }


        /* =================================================
           STUDENT DATA
        ================================================= */

        const student =
          data[0];


        console.log(
          "Student:",
          student
        );


        /* =================================================
           FIRST ACCESS / TEACHER RESET
        ================================================= */

        if (
          student.must_change_password ===
          true
        ) {
          

          sessionStorage.setItem(
            "pendingStudentId",
            student.student_id
          );


          sessionStorage.setItem(
            "pendingStudentNumber",
            String(
              student.student_number
              ??
              ""
            )
          );


          sessionStorage.setItem(
            "pendingStudentName",
            student.student_name
          );


          sessionStorage.setItem(
            "pendingClassName",
            student.class_name
          );


          sessionStorage.setItem(
            "pendingCurrentPassword",
            password
          );

          sessionStorage.setItem(
            "pendingSessionToken",
            student.session_token
          );

          showMessage(
            "ยืนยันตัวตนสำเร็จ กรุณาสร้างรหัสผ่านใหม่",
            "success"
          );


          setTimeout(
            function () {


              window.location.href =
                "change-password.html";


            },
            500
          );


          return;

        }


        /* =================================================
           NORMAL LOGIN
        ================================================= */

        localStorage.removeItem(
          "teacherLoggedIn"
        );


        localStorage.removeItem(
          "teacherId"
        );


        localStorage.setItem(
          "userRole",
          "student"
        );


        localStorage.setItem(
          "studentLoggedIn",
          "true"
        );


        localStorage.setItem(
          "studentId",
          student.student_id
        );


        localStorage.setItem(
          "studentNumber",
          String(
            student.student_number
            ??
            ""
          )
        );


        localStorage.setItem(
          "studentName",
          student.student_name
        );


        localStorage.setItem(
          "className",
          student.class_name
        );

        localStorage.setItem(
        "studentSessionToken",
        student.session_token
      );

        localStorage.setItem(
          "loginTime",
          new Date()
            .toISOString()
        );


        showMessage(
          "ยืนยันตัวตนสำเร็จ กำลังเข้าสู่ Mission HQ...",
          "success"
        );


        setTimeout(
          function () {


            window.location.href =
              "dashboard.html";


          },
          500
        );


      }

      catch (error) {


        console.error(
          "Student Login Error:",
          error
        );


        showMessage(
          "ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่อีกครั้ง"
        );


      }

      finally {


        if (
          studentLoginButton
        ) {

          studentLoginButton.disabled =
            false;


          studentLoginButton.innerHTML =
            oldButtonHTML;

        }

      }

    }


    /* =====================================================
       STUDENT FORM
    ===================================================== */

    if (
      studentForm
    ) {

      studentForm.addEventListener(
        "submit",
        studentLogin
      );

    }


    /* =====================================================
       STUDENT ID NUMBERS ONLY
    ===================================================== */

    if (
      studentIdInput
    ) {

      studentIdInput.addEventListener(
        "input",
        function () {


          studentIdInput.value =
            studentIdInput
              .value
              .replace(
                /\D/g,
                ""
              );

        }
      );

    }


    /* =====================================================
       TEACHER LOGIN
       ยังใช้ระบบครูเดิมชั่วคราว
    ===================================================== */

    if (
      teacherForm
    ) {

      teacherForm.addEventListener(
        "submit",
        function (event) {


          event.preventDefault();


          showMessage(
            "ระบบ Teacher Control จะเชื่อมฐานข้อมูลในขั้นถัดไป"
          );

        }
      );

    }


    /* =====================================================
       START
    ===================================================== */

    loadClassrooms();


  }
);