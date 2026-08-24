/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER LOGIN
   SUPABASE SESSION VERSION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const teacherForm =
      document.getElementById(
        "teacherForm"
      );


    const teacherUsername =
      document.getElementById(
        "teacherUsername"
      );


    const teacherPassword =
      document.getElementById(
        "teacherPassword"
      );


    const teacherPasswordToggle =
      document.getElementById(
        "teacherPasswordToggle"
      );


    /* =====================================================
       ELEMENT CHECK
    ===================================================== */

    if (
      !teacherForm
      ||
      !teacherUsername
      ||
      !teacherPassword
    ) {

      console.error(
        "ไม่พบ Element ของ Teacher Login"
      );


      return;

    }


    /* =====================================================
       CREATE MESSAGE ELEMENT
       เพราะ index เดิมยังไม่มี teacherMessage
    ===================================================== */

    let teacherMessage =
      document.getElementById(
        "teacherLoginMessage"
      );


    if (
      !teacherMessage
    ) {


      teacherMessage =
        document.createElement(
          "div"
        );


      teacherMessage.id =
        "teacherLoginMessage";


      teacherMessage.style.marginTop =
        "12px";


      teacherMessage.style.fontSize =
        "0.78rem";


      teacherMessage.style.textAlign =
        "center";


      teacherForm.appendChild(
        teacherMessage
      );

    }


    /* =====================================================
       SHOW MESSAGE
    ===================================================== */

    function showMessage(
      message,
      type = "error"
    ) {


      teacherMessage.textContent =
        message;


      if (
        type ===
        "success"
      ) {

        teacherMessage.style.color =
          "#2cff8c";

      }

      else if (
        type ===
        "warning"
      ) {

        teacherMessage.style.color =
          "#ffd21a";

      }

      else {

        teacherMessage.style.color =
          "#ff759e";

      }

    }


    /* =====================================================
       CLEAR OLD TEACHER SESSION
    ===================================================== */

    function clearTeacherSession() {


      localStorage.removeItem(
        "teacherLoggedIn"
      );


      localStorage.removeItem(
        "teacherId"
      );


      localStorage.removeItem(
        "teacherName"
      );


      localStorage.removeItem(
        "teacherSessionToken"
      );


      localStorage.removeItem(
        "teacherSessionExpiresAt"
      );


      /*
        ลบ role เฉพาะกรณีเป็นครู
      */

      if (
        localStorage.getItem(
          "userRole"
        )
        ===
        "teacher"
      ) {

        localStorage.removeItem(
          "userRole"
        );

      }

    }


    /* =====================================================
       CLEAR STUDENT LOGIN SESSION

       เมื่อครู Login
       ป้องกัน Session นักเรียนกับครูชนกัน
    ===================================================== */

    function clearStudentLoginSession() {


      localStorage.removeItem(
        "studentLoggedIn"
      );


      localStorage.removeItem(
        "studentId"
      );


      localStorage.removeItem(
        "studentNumber"
      );


      localStorage.removeItem(
        "studentName"
      );


      localStorage.removeItem(
        "className"
      );


      localStorage.removeItem(
        "studentSessionToken"
      );


      localStorage.removeItem(
        "loginTime"
      );


      sessionStorage.clear();

    }


    /* =====================================================
       TEACHER LOGIN
    ===================================================== */

    async function teacherLogin(
      event
    ) {


      event.preventDefault();


      showMessage(
        ""
      );


      const teacherId =
        teacherUsername
          .value
          .trim();


      const password =
        teacherPassword
          .value;


      /* ===================================================
         VALIDATE
      =================================================== */

      if (
        !teacherId
      ) {

        showMessage(
          "กรุณากรอก Controller ID"
        );


        teacherUsername.focus();


        return;

      }


      if (
        !password
      ) {

        showMessage(
          "กรุณากรอก Security Code"
        );


        teacherPassword.focus();


        return;

      }


      /* ===================================================
         BUTTON
      =================================================== */

      const submitButton =
        teacherForm.querySelector(
          'button[type="submit"]'
        );


      let oldButtonHTML =
        "";


      if (
        submitButton
      ) {

        oldButtonHTML =
          submitButton.innerHTML;


        submitButton.disabled =
          true;


        submitButton.innerHTML =
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
           CALL SUPABASE TEACHER LOGIN
        ================================================= */

        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "teacher_login",
            {

              p_teacher_id:
                teacherId,

              p_password:
                password

            }
          );


        if (
          error
        ) {

          throw error;

        }


        /* =================================================
           INVALID LOGIN
        ================================================= */

        if (
          !data
          ||
          data.length === 0
        ) {


          clearTeacherSession();


          showMessage(
            "Controller ID หรือ Security Code ไม่ถูกต้อง"
          );


          teacherPassword.value =
            "";


          teacherPassword.focus();


          return;

        }


        /* =================================================
           TEACHER
        ================================================= */

        const teacher =
          data[0];


        if (
          !teacher.session_token
        ) {

          throw new Error(
            "ไม่พบ Teacher Session Token"
          );

        }


        /* =================================================
           CLEAR OLD LOGIN
        ================================================= */

        clearTeacherSession();


        clearStudentLoginSession();


        /* =================================================
           SAVE TEACHER SESSION
        ================================================= */

        localStorage.setItem(
          "userRole",
          "teacher"
        );


        localStorage.setItem(
          "teacherLoggedIn",
          "true"
        );


        localStorage.setItem(
          "teacherId",
          teacher.teacher_id
        );


        localStorage.setItem(
          "teacherName",
          teacher.teacher_name
          ||
          ""
        );


        localStorage.setItem(
          "teacherSessionToken",
          teacher.session_token
        );


        localStorage.setItem(
          "teacherSessionExpiresAt",
          teacher.session_expires_at
          ||
          ""
        );


        /* =================================================
           SUCCESS
        ================================================= */

        showMessage(
          "ยืนยันตัวตนครูสำเร็จ กำลังเข้าสู่ Teacher Control...",
          "success"
        );


        console.log(
          "Teacher Login Success:",
          {
            teacherId:
              teacher.teacher_id,

            teacherName:
              teacher.teacher_name
          }
        );


        /* =================================================
           REDIRECT
        ================================================= */

        setTimeout(
          function () {


            window.location.href =
              "teacher/dashboard.html";

          },
          400
        );


      }

      catch (
        error
      ) {


        console.error(
          "Teacher Login Error:",
          error
        );


        clearTeacherSession();


        showMessage(
          "ไม่สามารถเชื่อมต่อระบบ Teacher Login ได้ กรุณาลองใหม่"
        );


      }

      finally {


        if (
          submitButton
        ) {

          submitButton.disabled =
            false;


          submitButton.innerHTML =
            oldButtonHTML;

        }

      }

    }


    /* =====================================================
       PASSWORD SHOW / HIDE
    ===================================================== */

    if (
      teacherPasswordToggle
    ) {


      teacherPasswordToggle.addEventListener(
        "click",
        function () {


          const hidden =
            teacherPassword.type ===
            "password";


          teacherPassword.type =
            hidden
              ?
              "text"
              :
              "password";


          teacherPasswordToggle.textContent =
            hidden
              ?
              "◉"
              :
              "◎";

        }
      );

    }


    /* =====================================================
       SUBMIT
    ===================================================== */

    teacherForm.addEventListener(
      "submit",
      teacherLogin
    );


    /* =====================================================
       ENTER
    ===================================================== */

    teacherPassword.addEventListener(
      "keydown",
      function (
        event
      ) {


        if (
          event.key ===
          "Enter"
        ) {

          /*
            form submit จะทำงานเอง
            ไม่ต้องเรียก teacherLogin ซ้ำ
          */

        }

      }
    );


    /* =====================================================
       START
       ถ้ามี session ครูเก่าอยู่
       ยังไม่ redirect ทันที
       เพราะหน้าครูจะ verify token ซ้ำ
    ===================================================== */

    console.log(
      "Teacher Login System Ready"
    );


  }
);