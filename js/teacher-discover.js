/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER • D DISCOVER
========================================================= */

console.log(
  "### TEACHER DISCOVER V2 LOADED ###"
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


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const classFilter =
      document.getElementById(
        "discoverClassFilter"
      );


    const statusFilter =
      document.getElementById(
        "discoverStatusFilter"
      );


    const searchInput =
      document.getElementById(
        "discoverStudentSearch"
      );


    const refreshButton =
      document.getElementById(
        "discoverRefreshButton"
      );


    const tableBody =
      document.getElementById(
        "discoverStudentTableBody"
      );


    const studentCount =
      document.getElementById(
        "discoverStudentCount"
      );


    const totalStudents =
      document.getElementById(
        "discoverTotalStudents"
      );


    const completedStudents =
      document.getElementById(
        "discoverCompletedStudents"
      );


    const pendingStudents =
      document.getElementById(
        "discoverPendingStudents"
      );


    const completionPercent =
      document.getElementById(
        "discoverCompletionPercent"
      );


    const progressCount =
      document.getElementById(
        "discoverProgressCount"
      );


    const progressBar =
      document.getElementById(
        "discoverMainProgressBar"
      );


    /* =====================================================
       MISSION CONTROL
    ===================================================== */

    const controlClassName =
      document.getElementById(
        "discoverControlClassName"
      );


    const unlockClassButton =
      document.getElementById(
        "unlockDiscoverClassButton"
      );


    const lockClassButton =
      document.getElementById(
        "lockDiscoverClassButton"
      );


    const controlMessage =
      document.getElementById(
        "discoverControlMessage"
      );


    /* =====================================================
       REQUIRED ELEMENTS
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
        "Teacher Discover: ไม่พบ Element ที่จำเป็น"
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
              กำลังโหลดข้อมูล...
            </td>

          </tr>
        `;


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "get_teacher_discover_students"
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
          "Discover students:",
          students.length
        );


      }

      catch (
        error
      ) {


        console.error(
          "Teacher Discover Error:",
          error
        );


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
                ไม่สามารถโหลดข้อมูล Discover ได้
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


    /* =====================================================
       CLASS FILTER
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
       SELECTED CLASS
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
       FILTER TABLE
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


          const completed =
            student.discover_completed ===
            true;


          if (
            status ===
            "completed"
            &&
            !completed
          ) {

            return false;

          }


          if (
            status ===
            "pending"
            &&
            completed
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
       CONTROL CLASS DISPLAY
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


      const completed =
        current.filter(
          function (
            student
          ) {

            return (
              student.discover_completed ===
              true
            );

          }
        )
        .length;


      const pending =
        total
        -
        completed;


      const percent =
        total ===
        0
        ?
        0
        :
        Math.round(
          completed
          /
          total
          *
          100
        );


      if (
        totalStudents
      ) {

        totalStudents.textContent =
          total;

      }


      if (
        completedStudents
      ) {

        completedStudents.textContent =
          completed;

      }


      if (
        pendingStudents
      ) {

        pendingStudents.textContent =
          pending;

      }


      if (
        completionPercent
      ) {

        completionPercent.textContent =
          percent
          +
          "%";

      }


      if (
        progressCount
      ) {

        progressCount.textContent =
          completed
          +
          " / "
          +
          total;

      }


      if (
        progressBar
      ) {

        progressBar.style.width =
          percent
          +
          "%";

      }

    }


    /* =====================================================
       RESET SUMMARY
    ===================================================== */

    function resetSummary() {


      if (
        totalStudents
      ) {

        totalStudents.textContent =
          "0";

      }


      if (
        completedStudents
      ) {

        completedStudents.textContent =
          "0";

      }


      if (
        pendingStudents
      ) {

        pendingStudents.textContent =
          "0";

      }


      if (
        completionPercent
      ) {

        completionPercent.textContent =
          "0%";

      }


      if (
        progressCount
      ) {

        progressCount.textContent =
          "0 / 0";

      }


      if (
        progressBar
      ) {

        progressBar.style.width =
          "0%";

      }

    }


    /* =====================================================
       RENDER TABLE
    ===================================================== */

    function renderTable() {


      const filtered =
        getFilteredStudents();


      if (
        studentCount
      ) {

        studentCount.textContent =
          filtered.length
          +
          " คน";

      }


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


          const completed =
            student.discover_completed ===
            true;


          const unlocked =
            student.discover_unlocked ===
            true;

/* =============================================
   ONLINE STATUS
============================================= */

let isOnline =
  false;

if (
  student.last_seen_at
) {

  const lastSeen =
    new Date(
      student.last_seen_at
    ).getTime();

  const now =
    Date.now();

  isOnline =
    (
      now - lastSeen
      <=
      90000
    );

}


const onlineHTML =
  isOnline
    ?
    `
      <span
        style="
          color:#2cff8c;
          font-weight:700;
        "
      >
        ● ใช้งานอยู่
      </span>
    `
    :
    `
      <span
        style="
          color:#6f838d;
        "
      >
        ○ ออฟไลน์
      </span>
    `;
          /* =============================================
             STATUS
          ============================================= */

          const statusHTML =
            completed
            ?
            `
              <span
                class="
                  teacher-discover-status
                  completed
                "
              >
                ✓ COMPLETED
              </span>
            `
            :
            `
              <span
                class="
                  teacher-discover-status
                  pending
                "
              >
                • PENDING
              </span>
            `;


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
             NEXT STEP

             A ยังต้องรอครูปลดล็อก A เอง
             จึงไม่บอกว่า A เปิดอัตโนมัติ
          ============================================= */

          const nextHTML =
            completed
            ?
            `
              <span
                class="
                  teacher-discover-next
                  open
                "
              >
                ✓ D COMPLETE
              </span>
            `
            :
            `
              <span
                class="
                  teacher-discover-next
                "
              >
                COMPLETE D FIRST
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
                ${onlineHTML}
              </td>

              <td>
                ${statusHTML}
              </td>


              <td>
                ${accessHTML}
              </td>


              <td>
                ${nextHTML}
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
       SET WHOLE CLASS ACCESS
    ===================================================== */

    async function setClassAccess(
      unlocked
    ) {


      const className =
        classFilter.value;


      if (
        !className
      ) {

        if (
          controlMessage
        ) {

          controlMessage.textContent =
            "กรุณาเลือกห้องเรียนก่อน";


          controlMessage.style.color =
            "#ffd21a";

        }


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


      const actionName =
        unlocked
        ?
        "ปลดล็อก"
        :
        "ล็อก";


      const confirmed =
        window.confirm(

          "ยืนยัน"
          +
          actionName
          +
          " D • Discover ทั้งห้อง "
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


        if (
          unlockClassButton
        ) {

          unlockClassButton.disabled =
            true;

        }


        if (
          lockClassButton
        ) {

          lockClassButton.disabled =
            true;

        }


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "teacher_set_discover_access",
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


        if (
          controlMessage
        ) {

          controlMessage.textContent =
            "✓ "
            +
            result.message;


          controlMessage.style.color =
            "#2cff8c";

        }


        await loadStudents();


      }

      catch (
        error
      ) {


        console.error(
          "Discover Class Access Error:",
          error
        );


        if (
          controlMessage
        ) {

          controlMessage.textContent =
            "ไม่สามารถเปลี่ยนสถานะ Discover ได้";


          controlMessage.style.color =
            "#ff759e";

        }

      }

      finally {


        if (
          unlockClassButton
        ) {

          unlockClassButton.disabled =
            false;

        }


        if (
          lockClassButton
        ) {

          lockClassButton.disabled =
            false;

        }

      }

    }


    /* =====================================================
       SET INDIVIDUAL STUDENT ACCESS
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
          " D • Discover\n\n"
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
            "teacher_set_discover_access",
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
          "Discover Student Access Error:",
          error
        );


        alert(
          "ไม่สามารถเปลี่ยนสิทธิ์ Discover ของนักเรียนได้"
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


    if (
      unlockClassButton
    ) {

      unlockClassButton.addEventListener(
        "click",
        function () {

          setClassAccess(
            true
          );

        }
      );

    }


    if (
      lockClassButton
    ) {

      lockClassButton.addEventListener(
        "click",
        function () {

          setClassAccess(
            false
          );

        }
      );

    }


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

const discoverAutoRefresh =
  setInterval(
    loadStudents,
    10000
  );

window.addEventListener(
  "beforeunload",
  function () {

    clearInterval(
      discoverAutoRefresh
    );

  }
);
    /* =====================================================
       START
    ===================================================== */

    await loadStudents();


  }
);