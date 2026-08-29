// Dashboard criteria v20260829-criteria-02: 85-100 ดีเยี่ยม, 70-84 ดี, 55-69 พอใช้, <55 ควรปรับปรุง
/* =========================================================
   MISSION DIGITAL DETECTIVE
   STUDENT DASHBOARD
   SUPABASE VERSION
========================================================= */

console.log(
  "### STUDENT DASHBOARD • MISSION LOCK V2 ###"
);


document.addEventListener(
  "DOMContentLoaded",
  async function () {


    /* =====================================================
       1. CHECK LOGIN SESSION
    ===================================================== */

    const studentLoggedIn =
      localStorage.getItem(
        "studentLoggedIn"
      );


    const userRole =
      localStorage.getItem(
        "userRole"
      );


    if (
      studentLoggedIn !==
      "true"
      ||
      userRole !==
      "student"
    ) {

      window.location.href =
        "index.html";

      return;

    }


    /* =====================================================
       2. STUDENT DATA
    ===================================================== */

    const student = {

      name:
        localStorage.getItem(
          "studentName"
        )
        ||
        "นักเรียน",

      studentId:
        localStorage.getItem(
          "studentId"
        )
        ||
        "-",

      studentNumber:
        localStorage.getItem(
          "studentNumber"
        )
        ||
        "-",

      classroom:
        localStorage.getItem(
          "className"
        )
        ||
        "-",

      sessionToken:
        localStorage.getItem(
          "studentSessionToken"
        )
        ||
        ""

    };


    /* =====================================================
       3. SESSION CHECK
    ===================================================== */

    if (
      !student.studentId
      ||
      student.studentId ===
      "-"
      ||
      !student.sessionToken
    ) {

      logoutStudent();

      return;

    }


    /* =====================================================
       4. MAIN PROFILE
    ===================================================== */

    const studentNameElement =
      document.getElementById(
        "studentName"
      );


    const studentIdElement =
      document.getElementById(
        "studentIdDisplay"
      );


    const classroomElement =
      document.getElementById(
        "classroomDisplay"
      );


    if (
      studentNameElement
    ) {

      studentNameElement.textContent =
        student.name;

    }


    if (
      studentIdElement
    ) {

      studentIdElement.textContent =
        student.studentId;

    }


    if (
      classroomElement
    ) {

      classroomElement.textContent =
        student.classroom;

    }


    /* =====================================================
       5. PROFILE CARD
    ===================================================== */

    const profileStudentName =
      document.getElementById(
        "profileStudentName"
      );


    const profileStudentId =
      document.getElementById(
        "profileStudentId"
      );


    if (
      profileStudentName
    ) {

      profileStudentName.textContent =
        student.name;

    }


    if (
      profileStudentId
    ) {

      profileStudentId.textContent =
        student.studentId;

    }


    /* =====================================================
       6. MISSION STATE

       สำคัญ:
       เริ่มต้นทุกภารกิจเป็น LOCKED
       จนกว่าจะโหลดสถานะจริงจาก Supabase
    ===================================================== */

    let missionState = {

      discover: {

        unlocked:
          false,

        completed:
          false

      },


      analyze: {

        unlocked:
          false,

        completed:
          false

      },


      reason: {

        unlocked:
          false,

        completed:
          false

      },


      evolve: {

        unlocked:
          false,

        completed:
          false

      }

    };


    /* =====================================================
       7. MISSION CONFIG
    ===================================================== */

    const missionConfig = {


      discover: {

        statusId:
          "discoverStatus",

        buttonId:
          "discoverButton",

        controlId:
          "controlDiscover",

        buttonOpen:
          "START DISCOVER →",

        buttonComplete:
          "✓ COMPLETED",

        buttonLocked:
          "🔒 WAIT FOR TEACHER"

      },


      analyze: {

        statusId:
          "analyzeStatus",

        buttonId:
          "analyzeButton",

        controlId:
          "controlAnalyze",

        buttonOpen:
          "ENTER ANALYZE →",

        buttonComplete:
          "✓ COMPLETED",

        buttonLocked:
          "🔒 WAIT FOR TEACHER"

      },


      reason: {

        statusId:
          "reasonStatus",

        buttonId:
          "reasonButton",

        controlId:
          "controlReason",

        buttonOpen:
          "ENTER FINAL MISSION →",

        buttonComplete:
          "✓ COMPLETED",

        buttonLocked:
          "🔒 WAIT FOR TEACHER"

      },


      evolve: {

        statusId:
          "evolveStatus",

        buttonId:
          "evolveButton",

        controlId:
          "controlEvolve",

        buttonOpen:
          "START REFLECTION →",

        buttonComplete:
          "✓ COMPLETED",

        buttonLocked:
          "🔒 REFLECTION LOCKED"

      }

    };


    /* =====================================================
       8. RENDER MISSION STATE
    ===================================================== */

    function renderMissionState() {


      let completedCount =
        0;


      Object
        .keys(
          missionState
        )
        .forEach(
          function (
            mission
          ) {


            const state =
              missionState[
                mission
              ];


            const config =
              missionConfig[
                mission
              ];


            const card =
              document.querySelector(
                `[data-mission="${mission}"]`
              );


            const status =
              document.getElementById(
                config.statusId
              );


            const button =
              document.getElementById(
                config.buttonId
              );


            const control =
              document.getElementById(
                config.controlId
              );


            if (
              !card
              ||
              !status
              ||
              !button
              ||
              !control
            ) {

              return;

            }


            /* ===============================================
               E • EVOLVE — REFLECTION → ASSIGNMENT
               ใช้สถานะย่อยเพื่อให้นักเรียนทำ Reflection
               ในชั้นเรียนก่อน แล้วกลับมาส่งงานภายหลัง
            =============================================== */

            if (
              mission === "evolve"
              &&
              state.completed !== true
              &&
              state.unlocked === true
            ) {

              card.classList.remove(
                "locked",
                "completed"
              );

              card.classList.add(
                "active"
              );

              button.disabled =
                false;

              status.className =
                "hq-mission-status";

              if (
                state.submitted === true
              ) {

                status.textContent =
                  "WAITING";

                button.textContent =
                  "ดูสถานะการส่งงาน →";

                button.dataset.page =
                  "info-mission.html";

                control.textContent =
                  "WAITING";

                control.className =
                  "control-open";

              }
              else if (
                state.reflectionCompleted === true
              ) {

                status.textContent =
                  "ASSIGNMENT";

                button.textContent =
                  "ส่ง INFO MISSION →";

                button.dataset.page =
                  "info-mission.html";

                control.textContent =
                  "ASSIGNMENT";

                control.className =
                  "control-open";

              }
              else {

                status.textContent =
                  "ACTIVE";

                button.textContent =
                  "START REFLECTION →";

                button.dataset.page =
                  "reflection.html";

                control.textContent =
                  "REFLECT";

                control.className =
                  "control-open";

              }

              return;

            }


            /* ===============================================
               COMPLETED
            =============================================== */

            if (
              state.completed
            ) {


              completedCount +=
                1;


              card.classList.remove(
                "locked",
                "active"
              );


              card.classList.add(
                "completed"
              );


              status.textContent =
                "COMPLETED";


              status.className =
                "hq-mission-status complete-label";


              button.textContent =
                config.buttonComplete;


              /*
                ทำเสร็จแล้วไม่จำเป็นต้องเข้าไปทำซ้ำ
                ถ้าครูต้องการให้ทำใหม่ ให้ RESET ก่อน
              */

              button.disabled =
                true;


              control.textContent =
                "COMPLETE";


              control.className =
                "control-complete";


              return;

            }


            /* ===============================================
               ACTIVE
            =============================================== */

            if (
              state.unlocked
            ) {


              card.classList.remove(
                "locked",
                "completed"
              );


              card.classList.add(
                "active"
              );


              status.textContent =
                "ACTIVE";


              status.className =
                "hq-mission-status";


              button.textContent =
                config.buttonOpen;


              button.disabled =
                false;


              control.textContent =
                "OPEN";


              control.className =
                "control-open";


              return;

            }


            /* ===============================================
               LOCKED
            =============================================== */

            card.classList.remove(
              "active",
              "completed"
            );


            card.classList.add(
              "locked"
            );


            status.textContent =
              "LOCKED";


            status.className =
              "hq-mission-status locked-label";


            button.textContent =
              config.buttonLocked;


            button.disabled =
              true;


            control.textContent =
              "LOCKED";


            control.className =
              "control-locked";


          }
        );


      /* =====================================================
         OVERALL PROGRESS
      ===================================================== */

      const percent =
        Math.round(
          completedCount
          /
          4
          *
          100
        );


      const completedMissionCount =
        document.getElementById(
          "completedMissionCount"
        );


      const overallProgressText =
        document.getElementById(
          "overallProgressText"
        );


      const overallProgressBar =
        document.getElementById(
          "overallProgressBar"
        );


      if (
        completedMissionCount
      ) {

        completedMissionCount.textContent =
          completedCount;

      }


      if (
        overallProgressText
      ) {

        overallProgressText.textContent =
          percent
          +
          "%";

      }


      if (
        overallProgressBar
      ) {

        overallProgressBar.style.width =
          percent
          +
          "%";

      }

    }

/* =====================================================
   FINAL DARE RESULT
===================================================== */

async function loadFinalResult() {

  const finalResultSection =
    document.getElementById(
      "finalResultSection"
    );


  if (
    !finalResultSection
  ) {

    return;

  }


  const dareCompleted =

    missionState.discover.completed === true

    &&

    missionState.analyze.completed === true

    &&

    missionState.reason.completed === true

    &&

    missionState.evolve.completed === true;


  /*
    ยังไม่ครบ 100%
    ไม่แสดงผลการประเมิน
  */

  if (
    !dareCompleted
  ) {

    finalResultSection.style.display =
      "none";

    return;

  }


  try {


    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "get_student_final_result",
        {

          p_student_id:
            student.studentId,

          p_session_token:
            student.sessionToken

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

      console.warn(
        "FINAL RESULT NOT FOUND"
      );

      return;

    }


    const result =
      data[0];


    console.log(
      "FINAL DARE RESULT:",
      result
    );


    /*
      ป้องกันการแสดงผล
      ถ้าฐานข้อมูลยังบอกว่าไม่ครบ
    */

    if (
      result.dare_completed !== true
    ) {

      finalResultSection.style.display =
        "none";

      return;

    }


    const totalScore =
      Number(
        result.total_score || 0
      );


    const maxScore =
      Number(
        result.max_score || 36
      );


    const percentage =
      Number(
        result.percentage || 0
      );


    const analyzeScore =
      Number(
        result.analyze_score || 0
      );


    const reasonScore =
      Number(
        result.reason_score || 0
      );


    const evolveScore =
      Number(
        result.evolve_score || 0
      );


    /* =================================================
       TOTAL SCORE
    ================================================= */

    const finalTotalScore =
      document.getElementById(
        "finalTotalScore"
      );


    if (
      finalTotalScore
    ) {

      finalTotalScore.textContent =
        totalScore
        +
        " / "
        +
        maxScore;

    }


    /* =================================================
       PERCENTAGE
    ================================================= */

    const finalPercentage =
      document.getElementById(
        "finalPercentage"
      );


    if (
      finalPercentage
    ) {

      finalPercentage.textContent =
        percentage.toFixed(2)
        +
        "%";

    }


    /* =================================================
       QUALITY + EVALUATION
       ใช้เกณฑ์เดียวกับหน้าสรุปผลรายบุคคลของครู

       85–100  = ระดับ 4 ดีเยี่ยม / ผ่าน
       70–84   = ระดับ 3 ดี / ผ่าน
       55–69   = ระดับ 2 พอใช้ / ไม่ผ่าน
       ต่ำกว่า 55 = ระดับ 1 ควรปรับปรุง / ไม่ผ่าน
    ================================================= */

    let qualityText =
      "ควรปรับปรุง";

    let evaluationText =
      "ไม่ผ่านการประเมิน";


    if (
      percentage >= 85
    ) {

      qualityText =
        "ดีเยี่ยม";

      evaluationText =
        "ผ่านการประเมิน";

    } else if (
      percentage >= 70
    ) {

      qualityText =
        "ดี";

      evaluationText =
        "ผ่านการประเมิน";

    } else if (
      percentage >= 55
    ) {

      qualityText =
        "พอใช้";

      evaluationText =
        "ไม่ผ่านการประเมิน";

    }


    const finalQuality =
      document.getElementById(
        "finalQuality"
      );


    if (
      finalQuality
    ) {

      finalQuality.textContent =
        qualityText;

    }


    const finalEvaluation =
      document.getElementById(
        "finalEvaluation"
      );


    if (
      finalEvaluation
    ) {

      finalEvaluation.textContent =
        evaluationText;

    }


    /* =================================================
       SCORE BREAKDOWN
    ================================================= */

    const finalAnalyzeScore =
      document.getElementById(
        "finalAnalyzeScore"
      );


    if (
      finalAnalyzeScore
    ) {

      finalAnalyzeScore.textContent =
        analyzeScore
        +
        " / 10";

    }


    const finalReasonScore =
      document.getElementById(
        "finalReasonScore"
      );


    if (
      finalReasonScore
    ) {

      finalReasonScore.textContent =
        reasonScore
        +
        " / 10";

    }


    const finalEvolveScore =
      document.getElementById(
        "finalEvolveScore"
      );


    if (
      finalEvolveScore
    ) {

      finalEvolveScore.textContent =
        evolveScore
        +
        " / 16";

    }


    /*
      แสดงเมื่อข้อมูลพร้อมแล้วเท่านั้น
    */

    finalResultSection.style.display =
      "block";


  }

  catch (
    error
  ) {

    console.error(
      "LOAD FINAL RESULT ERROR:",
      error
    );

  }

}
    /* =====================================================
       9. LOAD REAL MISSION STATE FROM SUPABASE
    ===================================================== */

    async function loadStudentProgress() {


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "get_student_mission_state",
            {

              p_student_id:
                student.studentId,

              p_session_token:
                student.sessionToken

            }
          );


        if (
          error
        ) {

          throw error;

        }


        /* ===============================================
           INVALID SESSION
        =============================================== */

        if (
          !data
          ||
          data.length ===
          0
        ) {

          alert(
            "Session หมดอายุ กรุณาเข้าสู่ระบบใหม่"
          );


          logoutStudent();

          return;

        }


        const progress =
          data[0];


        console.log(
          "MISSION STATE FROM DATABASE:",
          progress
        );


        /* =================================================
           D • DISCOVER

           ต้องให้ครูปลดล็อก
        ================================================= */

        missionState.discover = {

          unlocked:
            progress.discover_unlocked ===
            true,

          completed:
            progress.discover_completed ===
            true

        };


        /* =================================================
           A • ANALYZE

           ต้อง:
           1. ครูปลดล็อก A
           2. นักเรียนทำ D เสร็จแล้ว
        ================================================= */

        missionState.analyze = {

          unlocked:
            progress.analyze_unlocked ===
            true
            &&
            progress.discover_completed ===
            true,

          completed:
            progress.analyze_completed ===
            true

        };


        /* =================================================
           R • REASON

           ต้อง:
           1. ครูปลดล็อก R
           2. นักเรียนผ่าน A แล้ว
        ================================================= */

        missionState.reason = {

          unlocked:
            progress.reason_unlocked ===
            true
            &&
            progress.analyze_completed ===
            true,

          completed:
            progress.reason_completed ===
            true

        };


        /* =================================================
           E • EVOLVE

           ไม่ต้องให้ครูกด Unlock

           AUTO UNLOCK เมื่อ
           D + A + R ผ่านครบ
        ================================================= */

        const evolveAutoUnlocked =

          progress.discover_completed ===
          true

          &&

          progress.analyze_completed ===
          true

          &&

          progress.reason_completed ===
          true;


const localReflectionCompleted =
  localStorage.getItem(
    "evolveReflectionCompleted_"
    +
    student.studentId
  ) === "true"
  ||
  !!localStorage.getItem(
    "evolveReflection_"
    +
    student.studentId
  );

missionState.evolve = {

  unlocked:
    evolveAutoUnlocked,

  reflectionCompleted:
    progress.reflection_completed === true
    ||
    localReflectionCompleted,

  submitted:
    progress.evolve_submitted === true,

  completed:
    progress.evolve_completed ===
    true

};


renderMissionState();


/*
  ถ้าครบ 100%
  โหลดผลประเมินทันที
*/

await loadFinalResult();


      }

      catch (
        error
      ) {


        console.error(
          "Load Student Mission State Error:",
          error
        );


        /*
          ถ้าโหลดข้อมูลไม่สำเร็จ
          ไม่เปิดภารกิจใด ๆ เพื่อความปลอดภัย
        */

        missionState = {

          discover: {
            unlocked: false,
            completed: false
          },

          analyze: {
            unlocked: false,
            completed: false
          },

          reason: {
            unlocked: false,
            completed: false
          },

          evolve: {
            unlocked: false,
            completed: false
          }

        };


        renderMissionState();


        alert(
          "ไม่สามารถตรวจสอบสิทธิ์ภารกิจได้ กรุณาลองใหม่อีกครั้ง"
        );

      }

    }


    /* =====================================================
       10. MISSION BUTTONS
    ===================================================== */

    document
      .querySelectorAll(
        ".hq-mission-button"
      )
      .forEach(
        function (
          button
        ) {


          button.addEventListener(
            "click",
            function () {


              if (
                button.disabled
              ) {

                return;

              }


              const missionCard =
                button.closest(
                  "[data-mission]"
                );


              const mission =
                missionCard
                  ?.dataset
                  ?.mission;


              /*
                ตรวจซ้ำก่อนเปลี่ยนหน้า
              */

              if (
                mission
                &&
                missionState[
                  mission
                ]
                &&
                missionState[
                  mission
                ].unlocked !==
                true
              ) {

                alert(
                  "ภารกิจนี้ยังไม่เปิด กรุณารอครูผู้สอนปลดล็อก"
                );

                return;

              }


              const page =
                button.dataset.page;


              if (
                page
              ) {

                window.location.href =
                  page;

              }

            }
          );

        }
      );


    /* =====================================================
       11. LOGOUT
    ===================================================== */

async function logoutStudent() {

  /* =================================================
     SET STUDENT OFFLINE BEFORE LOGOUT
  ================================================= */

  try {

    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "student_go_offline",
        {
          p_student_id:
            student.studentId,

          p_session_token:
            student.sessionToken
        }
      );


    if (error) {

      console.error(
        "STUDENT OFFLINE ERROR:",
        error
      );

    }
    else {

      console.log(
        "STUDENT OFFLINE:",
        data
      );

    }

  }
  catch (error) {

    console.error(
      "STUDENT OFFLINE ERROR:",
      error
    );

  }


  /* =================================================
     CLEAR LOGIN DATA
  ================================================= */

  localStorage.removeItem(
    "userRole"
  );

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
    "loginTime"
  );

  localStorage.removeItem(
    "studentSessionToken"
  );


  /* TEMP PASSWORD */

  sessionStorage.removeItem(
    "pendingStudentId"
  );

  sessionStorage.removeItem(
    "pendingStudentNumber"
  );

  sessionStorage.removeItem(
    "pendingStudentName"
  );

  sessionStorage.removeItem(
    "pendingClassName"
  );

  sessionStorage.removeItem(
    "pendingCurrentPassword"
  );

  sessionStorage.removeItem(
    "pendingSessionToken"
  );


  /* =================================================
     RETURN TO LOGIN
  ================================================= */

  window.location.href =
    "index.html";

}

    /* =====================================================
       12. LOGOUT BUTTON
    ===================================================== */

    const logoutButton =
      document.getElementById(
        "logoutButton"
      );


    if (
      logoutButton
    ) {

      logoutButton.addEventListener(
        "click",
        logoutStudent
      );

    }


    /* =====================================================
       13. START
    ===================================================== */

    /*
      ตอนเปิดหน้า:
      ทุกภารกิจต้อง LOCKED ก่อน
    */

    renderMissionState();


    /*
      จากนั้นจึงโหลดสิทธิ์จริง
      จาก Supabase
    */

    await loadStudentProgress();

    /* =====================================================
       STUDENT ONLINE HEARTBEAT
    ===================================================== */
async function sendStudentHeartbeat() {

  try {

    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "student_heartbeat",
        {
          p_student_id:
            student.studentId,

          p_session_token:
            student.sessionToken
        }
      );


    if (error) {

      console.error(
        "STUDENT HEARTBEAT ERROR:",
        error
      );

      return;

    }


    console.log(
      "STUDENT HEARTBEAT:",
      data
    );

  }
  catch (error) {

    console.error(
      "STUDENT HEARTBEAT ERROR:",
      error
    );

  }

}
    /* ส่ง Heartbeat ครั้งแรกทันที */
    await sendStudentHeartbeat();


    /* ส่งซ้ำทุก 30 วินาที */
    const heartbeatInterval =
      setInterval(
        sendStudentHeartbeat,
        30000
      );
    /* =====================================================
       14. REALTIME MISSION STATUS
    ===================================================== */

    console.log(
      "STARTING REALTIME FOR STUDENT:",
      student.studentId
    );


    const realtimeChannel =
      supabaseClient
        .channel(
          "student-mission-" +
          student.studentId
        )

        .on(
          "postgres_changes",

          {

            event:
              "*",

            schema:
              "public",

            table:
              "student_progress",

            filter:
              "student_id=eq." +
              student.studentId

          },

          async function (
            payload
          ) {

            console.log(
              "MISSION STATE CHANGED:",
              payload
            );


            /*
              เมื่อครู
              - LOCK
              - UNLOCK
              - RESET

              ให้โหลดสถานะจริงใหม่ทันที
            */

            await loadStudentProgress();

          }
        )

        .subscribe(
          function (
            status,
            error
          ) {

            console.log(
              "REALTIME STATUS:",
              status
            );


            if (
              error
            ) {

              console.error(
                "REALTIME ERROR:",
                error
              );

            }


            if (
              status ===
              "SUBSCRIBED"
            ) {

              console.log(
                "✓ REALTIME CONNECTED"
              );

            }


            if (
              status ===
              "CHANNEL_ERROR"
            ) {

              console.error(
                "Realtime Channel Error"
              );

            }


            if (
              status ===
              "TIMED_OUT"
            ) {

              console.error(
                "Realtime Connection Timed Out"
              );

            }


            if (
              status ===
              "CLOSED"
            ) {

              console.warn(
                "Realtime Channel Closed"
              );

            }

          }
        );


    /* =====================================================
       15. CLEANUP REALTIME
    ===================================================== */

    window.addEventListener(
      "beforeunload",
      function () {

        clearInterval(
          heartbeatInterval
        );

        if (
          realtimeChannel
        ) {

          supabaseClient
            .removeChannel(
              realtimeChannel
            );

        }

      }
    );


  }
);