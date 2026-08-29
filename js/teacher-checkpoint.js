/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER • A ANALYZE
========================================================= */

console.log(
  "### TEACHER ANALYZE V1 LOADED ###"
);


document.addEventListener(
  "DOMContentLoaded",
  async function () {


    /* =====================================================
       LOGIN CHECK
    ===================================================== */

    if (
      localStorage.getItem(
        "teacherLoggedIn"
      )
      !==
      "true"
    ) {

      window.location.href =
        "../index.html";

      return;

    }


    /* =====================================================
       STATE
    ===================================================== */

    let students =
      [];


    const PASS_SCORE =
      7;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const classFilter =
      document.getElementById(
        "analyzeClassFilter"
      );


    const statusFilter =
      document.getElementById(
        "analyzeStatusFilter"
      );


    const searchInput =
      document.getElementById(
        "analyzeStudentSearch"
      );


    const refreshButton =
      document.getElementById(
        "analyzeRefreshButton"
      );


    const tableBody =
      document.getElementById(
        "analyzeStudentTableBody"
      );


    const studentCount =
      document.getElementById(
        "analyzeStudentCount"
      );


    const totalStudents =
      document.getElementById(
        "analyzeTotalStudents"
      );


    const passedStudents =
      document.getElementById(
        "analyzePassedStudents"
      );


    const failedStudents =
      document.getElementById(
        "analyzeFailedStudents"
      );


    const pendingStudents =
      document.getElementById(
        "analyzePendingStudents"
      );


    const averageScore =
      document.getElementById(
        "analyzeAverageScore"
      );


    const progressCount =
      document.getElementById(
        "analyzeProgressCount"
      );


    const progressBar =
      document.getElementById(
        "analyzeMainProgressBar"
      );


    /* =====================================================
       MISSION CONTROL
    ===================================================== */

    const controlClassName =
      document.getElementById(
        "analyzeControlClassName"
      );


    const unlockClassButton =
      document.getElementById(
        "unlockAnalyzeClassButton"
      );


    const lockClassButton =
      document.getElementById(
        "lockAnalyzeClassButton"
      );


    const controlMessage =
      document.getElementById(
        "analyzeControlMessage"
      );


    /* =====================================================
       ELEMENT CHECK
    ===================================================== */

    if (
      !classFilter
      ||
      !statusFilter
      ||
      !searchInput
      ||
      !refreshButton
      ||
      !tableBody
    ) {

      console.error(
        "Teacher Analyze: ไม่พบ Element ที่จำเป็น"
      );

      return;

    }


    /* =====================================================
       ROOM NUMBER
    ===================================================== */

    function getRoomNumber(
      className
    ) {

      if (
        !className
      ) {

        return 9999;

      }


      const parts =
        String(
          className
        )
        .trim()
        .split(
          "/"
        );


      const room =
        Number(
          parts[
            parts.length - 1
          ]
        );


      return Number.isNaN(
        room
      )
      ?
      9999
      :
      room;

    }


    /* =====================================================
       COMPARE CLASS
    ===================================================== */

    function compareClassNames(
      a,
      b
    ) {

      return (
        getRoomNumber(a)
        -
        getRoomNumber(b)
      );

    }


    /* =====================================================
       LOAD STUDENTS
    ===================================================== */

    async function loadStudents(
      options = {}
    ) {


      const silent =
        options
        &&
        options.silent === true;


      if (
        !silent
      ) {

        refreshButton.disabled =
          true;


        refreshButton.textContent =
          "LOADING...";


        tableBody.innerHTML =
        `
          <tr>

            <td
              colspan="8"
              class="teacher-table-message"
            >
              กำลังโหลดข้อมูล Analyze...
            </td>

          </tr>
        `;

      }


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "get_teacher_analyze_students"
          );


        if (
          error
        ) {

          throw error;

        }


        students =
          Array.isArray(
            data
          )
          ?
          data
          :
          [];

        students.sort(
          function (
            a,
            b
          ) {


            const classCompare =
              compareClassNames(
                a.class_name,
                b.class_name
              );


            if (
              classCompare !==
              0
            ) {

              return classCompare;

            }


            const numberA =
              Number(
                a.student_number
                ??
                9999
              );


            const numberB =
              Number(
                b.student_number
                ??
                9999
              );


            return (
              numberA
              -
              numberB
            );

          }
        );


        buildClassFilter();


        updateControlClass();


        renderPage();


        console.log(
          "Analyze students:",
          students.length
        );


      }

      catch (
        error
      ) {


        console.error(
          "Teacher Analyze Error:",
          error
        );


        if (
          !silent
        ) {

          tableBody.innerHTML =
            `
              <tr>

                <td
                  colspan="8"
                  class="teacher-table-message"
                  style="
                    color:#ff2e91 !important;
                  "
                >
                  ไม่สามารถโหลดข้อมูล Analyze ได้
                </td>

              </tr>
            `;


          resetSummary();

        }

      }

      finally {


        if (
          !silent
        ) {

          refreshButton.disabled =
            false;


          refreshButton.textContent =
            "↻ REFRESH";

        }

      }

    }


    /* =====================================================
       BUILD CLASS FILTER
    ===================================================== */

    function buildClassFilter() {


      const oldValue =
        classFilter.value;


      const classes =
        [
          ...new Set(

            students
              .map(
                function (
                  student
                ) {

                  return (
                    student.class_name
                    ||
                    ""
                  )
                  .trim();

                }
              )
              .filter(
                Boolean
              )

          )
        ];


      classes.sort(
        compareClassNames
      );


      classFilter.innerHTML =
        `
          <option value="">
            ทุกห้องเรียน
          </option>
        `;


      classes.forEach(
        function (
          className
        ) {


          const option =
            document.createElement(
              "option"
            );


          option.value =
            className;


          option.textContent =
            className;


          classFilter.appendChild(
            option
          );

        }
      );


      if (
        classes.includes(
          oldValue
        )
      ) {

        classFilter.value =
          oldValue;

      }

    }


    /* =====================================================
       CLASS STUDENTS
    ===================================================== */

    function getClassStudents() {


      const className =
        classFilter.value;


      if (
        !className
      ) {

        return students;

      }


      return students.filter(
        function (
          student
        ) {

          return (
            student.class_name ===
            className
          );

        }
      );

    }


    /* =====================================================
       RESULT STATUS
    ===================================================== */

    function getAnalyzeResult(
      student
    ) {


      if (
        student.analyze_submitted !==
        true
      ) {

        return "pending";

      }


      const score =
        Number(
          student.analyze_score
          ??
          0
        );


      return (
        score >=
        PASS_SCORE
      )
      ?
      "passed"
      :
      "failed";

    }


    /* =====================================================
       FILTERED STUDENTS
    ===================================================== */

    function getFilteredStudents() {


      const status =
        statusFilter.value;


      const keyword =
        searchInput
          .value
          .trim()
          .toLowerCase();


      return getClassStudents().filter(
        function (
          student
        ) {


          const result =
            getAnalyzeResult(
              student
            );


          if (
            status
            &&
            result !==
            status
          ) {

            return false;

          }


          if (
            keyword
          ) {


            const searchable =
              [
                student.student_number,
                student.student_id,
                student.student_name,
                student.class_name
              ]
              .join(
                " "
              )
              .toLowerCase();


            if (
              !searchable.includes(
                keyword
              )
            ) {

              return false;

            }

          }


          return true;

        }
      );

    }


    /* =====================================================
       CONTROL CLASS
    ===================================================== */

    function updateControlClass() {


      if (
        !controlClassName
      ) {

        return;

      }


      controlClassName.textContent =
        classFilter.value
        ||
        "กรุณาเลือกห้องเรียน";

    }


    /* =====================================================
       SUMMARY
    ===================================================== */

    function renderSummary() {


      const current =
        getClassStudents();


      const total =
        current.length;


      const submitted =
        current.filter(
          function (
            student
          ) {

            return (
              student.analyze_submitted ===
              true
            );

          }
        );


      const passed =
        submitted.filter(
          function (
            student
          ) {

            return (
              Number(
                student.analyze_score
                ??
                0
              )
              >=
              PASS_SCORE
            );

          }
        )
        .length;


      const failed =
        submitted.length
        -
        passed;


      const pending =
        total
        -
        submitted.length;
const totalScore =
  current.reduce(
    function (
      sum,
      student
    ) {

      return (
        sum
        +
        Number(
          student.analyze_score
          ??
          0
        )
      );

    },
    0
  );


const average =
  total ===
  0
    ?
    0
    :
    totalScore
    /
    total;

      const percent =
        total ===
        0
        ?
        0
        :
        Math.round(
          passed
          /
          total
          *
          100
        );


      totalStudents.textContent =
        total;


      passedStudents.textContent =
        passed;


      failedStudents.textContent =
        failed;


      pendingStudents.textContent =
        pending;


      averageScore.textContent =
        average.toFixed(
          2
        );


      progressCount.textContent =
        passed
        +
        " / "
        +
        total;


      progressBar.style.width =
        percent
        +
        "%";

    }


    /* =====================================================
       RESET SUMMARY
    ===================================================== */

    function resetSummary() {


      totalStudents.textContent =
        "0";


      passedStudents.textContent =
        "0";


      failedStudents.textContent =
        "0";


      pendingStudents.textContent =
        "0";


      averageScore.textContent =
        "0.00";


      progressCount.textContent =
        "0 / 0";


      progressBar.style.width =
        "0%";

    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderTable() {


      const filtered =
        getFilteredStudents();


      studentCount.textContent =
        filtered.length
        +
        " คน";


      tableBody.innerHTML =
        "";


      if (
        filtered.length ===
        0
      ) {


        tableBody.innerHTML =
          `
            <tr>

              <td
                colspan="8"
                class="teacher-table-message"
              >
                ไม่พบข้อมูลนักเรียน
              </td>

            </tr>
          `;


        return;

      }


      filtered.forEach(
        function (
          student
        ) {


          const row =
            document.createElement(
              "tr"
            );


          const unlocked =
            student.analyze_unlocked ===
            true;


          const submitted =
            student.analyze_submitted ===
            true;


          const score =
            Number(
              student.analyze_score
              ??
              0
            );


          const result =
            getAnalyzeResult(
              student
            );


          /* =============================================
             ACCESS
          ============================================= */

          const accessHTML =
            unlocked
            ?
            `
              <button
                type="button"
                class="
                  teacher-student-access-button
                  unlocked
                "
              >
                🔓 OPEN
              </button>
            `
            :
            `
              <button
                type="button"
                class="
                  teacher-student-access-button
                  locked
                "
              >
                🔒 LOCKED
              </button>
            `;


          /* =============================================
             SCORE
          ============================================= */

          const scoreHTML =
            submitted
            ?
            `
              <strong
                class="teacher-purple-text"
              >
                ${escapeHTML(score)} / 10
              </strong>
            `
            :
            `
              <span
                class="teacher-muted"
              >
                -
              </span>
            `;


          /* =============================================
             RESULT
          ============================================= */

          let resultHTML;


          if (
            result ===
            "passed"
          ) {

            resultHTML =
              `
                <span
                  class="
                    teacher-discover-status
                    completed
                  "
                >
                  ✓ ผ่านเกณฑ์
                </span>
              `;

          }

          else if (
            result ===
            "failed"
          ) {

            resultHTML =
              `
                <span
                  class="
                    teacher-analyze-result
                    failed
                  "
                >
                  ✕ ไม่ผ่าน
                </span>
              `;

          }

          else {

            resultHTML =
              `
                <span
                  class="
                    teacher-discover-status
                    pending
                  "
                >
                  • ยังไม่ส่ง
                </span>
              `;

          }


          /* =============================================
             COMPLETED
          ============================================= */

          const completedHTML =
            student.analyze_completed ===
            true
            ?
            `
              <span class="teacher-green">
                COMPLETE
              </span>
            `
            :
            `
              <span class="teacher-yellow">
                PENDING
              </span>
            `;


          row.innerHTML =
            `

              <td>
                ${escapeHTML(
                  student.student_number
                  ??
                  "-"
                )}
              </td>


              <td>
                ${escapeHTML(
                  student.student_id
                  ||
                  "-"
                )}
              </td>


              <td>
                ${escapeHTML(
                  student.student_name
                  ||
                  "-"
                )}
              </td>


              <td>
                ${escapeHTML(
                  student.class_name
                  ||
                  "-"
                )}
              </td>


              <td>
                ${accessHTML}
              </td>


              <td>
                ${scoreHTML}
              </td>


              <td>
                ${resultHTML}
              </td>


              <td>
                ${completedHTML}
              </td>

            `;


          const accessButton =
            row.querySelector(
              ".teacher-student-access-button"
            );


          if (
            accessButton
          ) {

            accessButton.addEventListener(
              "click",
              async function () {

                await setStudentAccess(
                  student,
                  !unlocked
                );

              }
            );

          }


          tableBody.appendChild(
            row
          );

        }
      );

    }


    /* =====================================================
       RENDER PAGE
    ===================================================== */

    function renderPage() {


      renderSummary();


      renderTable();

    }


    /* =====================================================
       SET CLASS ACCESS
    ===================================================== */

    async function setClassAccess(
      unlocked
    ) {


      const className =
        classFilter.value;


      if (
        !className
      ) {

        controlMessage.textContent =
          "กรุณาเลือกห้องเรียนก่อน";


        controlMessage.style.color =
          "#ffd21a";


        return;

      }


      const token =
        localStorage.getItem(
          "teacherSessionToken"
        );


      if (
        !token
      ) {

        window.location.href =
          "../index.html";

        return;

      }


      const confirmed =
        window.confirm(
          (
            unlocked
            ?
            "ยืนยันปลดล็อก A • Analyze ทั้งห้อง "
            :
            "ยืนยันล็อก A • Analyze ทั้งห้อง "
          )
          +
          className
          +
          " ?"
        );


      if (
        !confirmed
      ) {

        return;

      }


      try {


        unlockClassButton.disabled =
          true;


        lockClassButton.disabled =
          true;


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "teacher_set_analyze_access",
            {

              p_session_token:
                token,

              p_class_name:
                className,

              p_student_id:
                null,

              p_unlocked:
                unlocked

            }
          );


        if (
          error
        ) {

          throw error;

        }


        const result =
          data?.[0];


        if (
          !result
          ||
          result.success !==
          true
        ) {

          throw new Error(
            result?.message
            ||
            "ไม่สามารถเปลี่ยนสถานะได้"
          );

        }


        controlMessage.textContent =
          "✓ "
          +
          result.message;


        controlMessage.style.color =
          "#2cff8c";


        await loadStudents();


      }

      catch (
        error
      ) {


        console.error(
          "Analyze Class Access Error:",
          error
        );


        controlMessage.textContent =
          "ไม่สามารถเปลี่ยนสถานะ Analyze ได้";


        controlMessage.style.color =
          "#ff759e";

      }

      finally {


        unlockClassButton.disabled =
          false;


        lockClassButton.disabled =
          false;

      }

    }


    /* =====================================================
       SET STUDENT ACCESS
    ===================================================== */

    async function setStudentAccess(
      student,
      unlocked
    ) {


      const token =
        localStorage.getItem(
          "teacherSessionToken"
        );


      if (
        !token
      ) {

        window.location.href =
          "../index.html";

        return;

      }


      const actionName =
        unlocked
        ?
        "ปลดล็อก"
        :
        "ล็อก";


      const confirmed =
        window.confirm(
          actionName
          +
          " A • Analyze\n\n"
          +
          "นักเรียน: "
          +
          student.student_name
          +
          "\nเลขที่: "
          +
          (
            student.student_number
            ??
            "-"
          )
          +
          "\nห้อง: "
          +
          student.class_name
          +
          " ?"
        );


      if (
        !confirmed
      ) {

        return;

      }


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "teacher_set_analyze_access",
            {

              p_session_token:
                token,

              p_class_name:
                null,

              p_student_id:
                student.student_id,

              p_unlocked:
                unlocked

            }
          );


        if (
          error
        ) {

          throw error;

        }


        const result =
          data?.[0];


        if (
          !result
          ||
          result.success !==
          true
        ) {

          throw new Error(
            result?.message
            ||
            "ไม่สามารถเปลี่ยนสถานะได้"
          );

        }


        await loadStudents();


      }

      catch (
        error
      ) {


        console.error(
          "Analyze Student Access Error:",
          error
        );


        alert(
          "ไม่สามารถเปลี่ยนสิทธิ์ Analyze ของนักเรียนได้"
        );

      }

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    classFilter.addEventListener(
      "change",
      function () {


        updateControlClass();


        renderPage();

      }
    );


    statusFilter.addEventListener(
      "change",
      function () {

        renderTable();

      }
    );


    searchInput.addEventListener(
      "input",
      function () {

        renderTable();

      }
    );


    refreshButton.addEventListener(
      "click",
      loadStudents
    );


    unlockClassButton.addEventListener(
      "click",
      function () {

        setClassAccess(
          true
        );

      }
    );


    lockClassButton.addEventListener(
      "click",
      function () {

        setClassAccess(
          false
        );

      }
    );


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(
      value
    ) {

      return String(
        value
        ??
        ""
      )
      .replaceAll(
        "&",
        "&amp;"
      )
      .replaceAll(
        "<",
        "&lt;"
      )
      .replaceAll(
        ">",
        "&gt;"
      )
      .replaceAll(
        '"',
        "&quot;"
      )
      .replaceAll(
        "'",
        "&#039;"
      );

    }


    /* =====================================================
       LIVE A • ANALYZE UPDATE
       1) รับ Broadcast จากหน้าผู้เรียนทันที
       2) ฟัง student_progress เผื่อ Postgres Realtime อนุญาต
       3) มี silent fallback ทุก 5 วินาที ไม่ต้องกด F5
    ===================================================== */

    let analyzeLiveTimer =
      null;


    function scheduleAnalyzeLiveRefresh(
      delay = 120
    ) {

      clearTimeout(
        analyzeLiveTimer
      );


      analyzeLiveTimer =
        setTimeout(
          function () {

            loadStudents({
              silent: true
            });

          },
          delay
        );

    }


    const analyzeLiveChannel =
      supabaseClient
        .channel(
          "mission-live-results"
        )
        .on(
          "broadcast",
          {
            event:
              "student-result-updated"
          },
          function (message) {

            const payload =
              message
              &&
              message.payload
              ?
              message.payload
              :
              {};


            if (
              payload.stage ===
              "analyze"
            ) {

              scheduleAnalyzeLiveRefresh();

            }

          }
        )
        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "student_progress"
          },
          function () {

            scheduleAnalyzeLiveRefresh();

          }
        )
        .subscribe(
          function (status) {

            console.log(
              "TEACHER ANALYZE LIVE STATUS:",
              status
            );

          }
        );


    const analyzeLiveFallback =
      setInterval(
        function () {

          if (
            document.visibilityState ===
            "visible"
          ) {

            scheduleAnalyzeLiveRefresh(
              0
            );

          }

        },
        5000
      );


    window.addEventListener(
      "beforeunload",
      function () {

        clearTimeout(
          analyzeLiveTimer
        );


        clearInterval(
          analyzeLiveFallback
        );


        if (
          analyzeLiveChannel
        ) {

          supabaseClient
            .removeChannel(
              analyzeLiveChannel
            );

        }

      }
    );


    /* =====================================================
       START
    ===================================================== */

    await loadStudents();


  }
);