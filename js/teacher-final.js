/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER • R REASON
========================================================= */

console.log(
  "### TEACHER REASON V1 LOADED ###"
);


document.addEventListener(
  "DOMContentLoaded",
  async function () {


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


    let students =
      [];


    const PASS_SCORE =
      7;


    const classFilter =
      document.getElementById(
        "reasonClassFilter"
      );


    const statusFilter =
      document.getElementById(
        "reasonStatusFilter"
      );


    const searchInput =
      document.getElementById(
        "reasonStudentSearch"
      );


    const refreshButton =
      document.getElementById(
        "reasonRefreshButton"
      );


    const tableBody =
      document.getElementById(
        "reasonStudentTableBody"
      );


    const studentCount =
      document.getElementById(
        "reasonStudentCount"
      );


    const totalStudents =
      document.getElementById(
        "reasonTotalStudents"
      );


    const passedStudents =
      document.getElementById(
        "reasonPassedStudents"
      );


    const failedStudents =
      document.getElementById(
        "reasonFailedStudents"
      );


    const pendingStudents =
      document.getElementById(
        "reasonPendingStudents"
      );


    const averageScore =
      document.getElementById(
        "reasonAverageScore"
      );


    const progressCount =
      document.getElementById(
        "reasonProgressCount"
      );


    const progressBar =
      document.getElementById(
        "reasonMainProgressBar"
      );


    const controlClassName =
      document.getElementById(
        "reasonControlClassName"
      );


    const unlockClassButton =
      document.getElementById(
        "unlockReasonClassButton"
      );


    const lockClassButton =
      document.getElementById(
        "lockReasonClassButton"
      );


    const controlMessage =
      document.getElementById(
        "reasonControlMessage"
      );


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
        "Teacher Reason: ไม่พบ Element ที่จำเป็น"
      );

      return;

    }


    function getRoomNumber(
      className
    ) {

      const parts =
        String(
          className
          ||
          ""
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


    async function loadStudents() {


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
              กำลังโหลดข้อมูล Reason...
            </td>
          </tr>
        `;


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "get_teacher_reason_students"
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
    ? data
    : [];

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


            return (
              Number(
                a.student_number
                ??
                9999
              )
              -
              Number(
                b.student_number
                ??
                9999
              )
            );

          }
        );


        buildClassFilter();


        updateControlClass();


        renderPage();


      }

      catch (
        error
      ) {


        console.error(
          "Teacher Reason Error:",
          error
        );


        tableBody.innerHTML =
          `
            <tr>
              <td
                colspan="8"
                class="teacher-table-message"
                style="color:#ff2e91 !important;"
              >
                ไม่สามารถโหลดข้อมูล Reason ได้
              </td>
            </tr>
          `;


        resetSummary();

      }

      finally {


        refreshButton.disabled =
          false;


        refreshButton.textContent =
          "↻ REFRESH";

      }

    }


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


    function getReasonResult(
      student
    ) {


      if (
        student.reason_submitted !==
        true
      ) {

        return "pending";

      }


      return (
        Number(
          student.reason_score
          ??
          0
        )
        >=
        PASS_SCORE
      )
      ?
      "passed"
      :
      "failed";

    }


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
            getReasonResult(
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


    function updateControlClass() {


      controlClassName.textContent =
        classFilter.value
        ||
        "กรุณาเลือกห้องเรียน";

    }


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
              student.reason_submitted ===
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
                student.reason_score
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
          student.reason_score
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
            student.reason_unlocked ===
            true;


          const submitted =
            student.reason_submitted ===
            true;


          const score =
            Number(
              student.reason_score
              ??
              0
            );


          const result =
            getReasonResult(
              student
            );


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


          const scoreHTML =
            submitted
            ?
            `
              <strong class="teacher-yellow">
                ${escapeHTML(score)} / 10
              </strong>
            `
            :
            "-";


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


          const completedHTML =
            student.reason_completed ===
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


    function renderPage() {

      renderSummary();
      renderTable();

    }


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
            "ยืนยันปลดล็อก R • Reason ทั้งห้อง "
            :
            "ยืนยันล็อก R • Reason ทั้งห้อง "
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
            "teacher_set_reason_access",
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
          "Reason Class Access Error:",
          error
        );


        controlMessage.textContent =
          "ไม่สามารถเปลี่ยนสถานะ Reason ได้";


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
          " R • Reason\n\n"
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
            "teacher_set_reason_access",
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
          "Reason Student Access Error:",
          error
        );


        alert(
          "ไม่สามารถเปลี่ยนสิทธิ์ Reason ของนักเรียนได้"
        );

      }

    }


    classFilter.addEventListener(
      "change",
      function () {

        updateControlClass();
        renderPage();

      }
    );


    statusFilter.addEventListener(
      "change",
      renderTable
    );


    searchInput.addEventListener(
      "input",
      renderTable
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
   REALTIME REASON UPDATE
   อัปเดตคะแนน/สถานะ R อัตโนมัติ
===================================================== */

let reasonRealtimeTimer =
  null;


const reasonRealtimeChannel =
  supabaseClient
    .channel(
      "teacher-reason-realtime"
    )

    .on(
      "postgres_changes",

      {
        event:
          "UPDATE",

        schema:
          "public",

        table:
          "student_progress"
      },

      function (
        payload
      ) {

        console.log(
          "REASON PROGRESS CHANGED:",
          payload
        );


        clearTimeout(
          reasonRealtimeTimer
        );


        reasonRealtimeTimer =
          setTimeout(
            async function () {

              console.log(
                "AUTO REFRESH REASON"
              );

              await loadStudents();

            },
            300
          );

      }
    )

    .subscribe(
      function (
        status
      ) {

        console.log(
          "TEACHER REASON REALTIME STATUS:",
          status
        );

      }
    );


/* =====================================================
   CLEANUP REALTIME
===================================================== */

window.addEventListener(
  "beforeunload",
  function () {

    if (
      reasonRealtimeChannel
    ) {

      supabaseClient
        .removeChannel(
          reasonRealtimeChannel
        );

    }

  }
);
    await loadStudents();


  }
);