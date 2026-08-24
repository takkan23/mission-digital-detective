/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER AUTH GUARD
========================================================= */

async function verifyTeacherSession() {

  const teacherLoggedIn =
    localStorage.getItem(
      "teacherLoggedIn"
    );

  const teacherSessionToken =
    localStorage.getItem(
      "teacherSessionToken"
    );

  const userRole =
    localStorage.getItem(
      "userRole"
    );


  if (
    teacherLoggedIn !== "true"
    ||
    userRole !== "teacher"
    ||
    !teacherSessionToken
  ) {

    clearTeacherSession();

    window.location.href =
      "../index.html";

    return null;

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "verify_teacher_session",
        {
          p_session_token:
            teacherSessionToken
        }
      );


    if (error) {

      throw error;

    }


    if (
      !data
      ||
      data.length === 0
      ||
      data[0].valid !== true
    ) {

      alert(
        "Session ของครูหมดอายุ กรุณาเข้าสู่ระบบใหม่"
      );

      clearTeacherSession();

      window.location.href =
        "../index.html";

      return null;

    }


    const teacher =
      data[0];


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


    return teacher;

  }

  catch (error) {

    console.error(
      "Teacher Session Error:",
      error
    );


    alert(
      "ไม่สามารถตรวจสอบ Teacher Session ได้"
    );


    clearTeacherSession();


    window.location.href =
      "../index.html";


    return null;

  }

}


/* =========================================================
   CLEAR TEACHER SESSION
========================================================= */

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


  if (
    localStorage.getItem(
      "userRole"
    ) === "teacher"
  ) {

    localStorage.removeItem(
      "userRole"
    );

  }

}


/* =========================================================
   TEACHER LOGOUT
========================================================= */

async function logoutTeacher() {

  const token =
    localStorage.getItem(
      "teacherSessionToken"
    );


  try {

    if (token) {

      await supabaseClient.rpc(
        "teacher_logout",
        {
          p_session_token:
            token
        }
      );

    }

  }

  catch (error) {

    console.warn(
      "Teacher Logout Error:",
      error
    );

  }

  finally {

    clearTeacherSession();

    window.location.href =
      "../index.html";

  }

}
/* =========================================================
   AUTO CHECK TEACHER SESSION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    await verifyTeacherSession();

  }
);
/* =========================================================
   AUTO VERIFY TEACHER SESSION
   ตรวจอัตโนมัติทุกหน้าที่โหลด teacher-auth.js
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    const teacher =
      await verifyTeacherSession();


    if (
      !teacher
    ) {

      return;

    }


    console.log(
      "Teacher Session Verified:",
      teacher.teacher_name
    );

  }
);