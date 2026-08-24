/* =========================================================
   MISSION DIGITAL DETECTIVE
   STUDENT MISSION ACCESS GUARD
========================================================= */

async function verifyStudentMissionAccess(
  mission
) {


  const studentLoggedIn =
    localStorage.getItem(
      "studentLoggedIn"
    );


  const userRole =
    localStorage.getItem(
      "userRole"
    );


  const studentId =
    localStorage.getItem(
      "studentId"
    );


  const sessionToken =
    localStorage.getItem(
      "studentSessionToken"
    );


  /* =====================================================
     LOGIN CHECK
  ===================================================== */

  if (
    studentLoggedIn !==
    "true"
    ||
    userRole !==
    "student"
    ||
    !studentId
    ||
    !sessionToken
  ) {

    window.location.href =
      "index.html";

    return false;

  }


  try {


    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "get_student_mission_state",
        {

          p_student_id:
            studentId,

          p_session_token:
            sessionToken

        }
      );


    if (
      error
    ) {

      throw error;

    }


    if (
      !data
      ||
      data.length === 0
    ) {

      window.location.href =
        "index.html";

      return false;

    }


    const state =
      data[0];


    let allowed =
      false;


    /* =====================================================
       DISCOVER
    ===================================================== */

    if (
      mission ===
      "discover"
    ) {

      allowed =
        state.discover_unlocked ===
        true;

    }


    /* =====================================================
       ANALYZE
    ===================================================== */

    else if (
      mission ===
      "analyze"
    ) {

      allowed =
        state.analyze_unlocked ===
        true
        &&
        state.discover_completed ===
        true;

    }


    /* =====================================================
       REASON
    ===================================================== */

    else if (
      mission ===
      "reason"
    ) {

      allowed =
        state.reason_unlocked ===
        true
        &&
        state.analyze_completed ===
        true;

    }


    /* =====================================================
       EVOLVE
    ===================================================== */

    else if (
      mission ===
      "evolve"
    ) {

      allowed =
        state.evolve_unlocked ===
        true;

    }


    /* =====================================================
       LOCKED
    ===================================================== */

    if (
      !allowed
    ) {

      alert(
        "ภารกิจนี้ยังไม่เปิด กรุณารอครูผู้สอนปลดล็อก"
      );


      window.location.href =
        "dashboard.html";


      return false;

    }


    return true;


  }

  catch (
    error
  ) {


    console.error(
      "Mission Guard Error:",
      error
    );


    window.location.href =
      "dashboard.html";


    return false;

  }

}