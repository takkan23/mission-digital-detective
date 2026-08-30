console.log(
  "### TEACHER CLASS JS NEW VERSION 21-08-2026 ###"
);
/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER • CLASS MANAGEMENT
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  async function () {


    /* =====================================================
       BASIC LOGIN CHECK
       teacher-auth.js จะตรวจ Session จริงให้อีกชั้น
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


    let selectedStudent =
      null;


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const classFilter =
      document.getElementById(
        "classManagementFilter"
      );


    const accountFilter =
      document.getElementById(
        "accountStatusFilter"
      );


    const searchInput =
      document.getElementById(
        "classStudentSearch"
      );


    const refreshButton =
      document.getElementById(
        "classRefreshButton"
      );


    const tableBody =
      document.getElementById(
        "classStudentTableBody"
      );


    const studentCount =
      document.getElementById(
        "classStudentCount"
      );


    const modal =
      document.getElementById(
        "passwordResetModal"
      );


    const closeModalButton =
      document.getElementById(
        "closePasswordModal"
      );


    const confirmResetButton =
      document.getElementById(
        "confirmPasswordResetButton"
      );


    const resetStudentName =
      document.getElementById(
        "resetStudentName"
      );


    const resetStudentId =
      document.getElementById(
        "resetStudentId"
      );


    const passwordResetConfirm =
      document.getElementById(
        "passwordResetConfirm"
      );


    const temporaryPasswordPanel =
      document.getElementById(
        "temporaryPasswordPanel"
      );


    const temporaryPassword =
      document.getElementById(
        "temporaryPassword"
      );


    const copyPasswordButton =
      document.getElementById(
        "copyTemporaryPasswordButton"
      );
/* =====================================================
   RESET PROGRESS ELEMENTS
===================================================== */

const progressResetModal =
  document.getElementById(
    "progressResetModal"
  );


const progressResetBackdrop =
  document.getElementById(
    "progressResetBackdrop"
  );


const closeProgressResetModalButton =
  document.getElementById(
    "closeProgressResetModal"
  );


const cancelProgressResetButton =
  document.getElementById(
    "cancelProgressResetButton"
  );


const confirmProgressResetButton =
  document.getElementById(
    "confirmProgressResetButton"
  );


const progressResetStudentName =
  document.getElementById(
    "progressResetStudentName"
  );


const progressResetStudentInfo =
  document.getElementById(
    "progressResetStudentInfo"
  );


const progressResetMessage =
  document.getElementById(
    "progressResetMessage"
  );

    /* =====================================================
       ELEMENT CHECK
    ===================================================== */

    if (
      !classFilter
      ||
      !accountFilter
      ||
      !searchInput
      ||
      !refreshButton
      ||
      !tableBody
    ) {

      console.error(
        "Teacher Class: ไม่พบ Element ที่จำเป็น"
      );

      return;

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
              colspan="7"
              class="teacher-table-message"
            >
              กำลังโหลดข้อมูลนักเรียน...
            </td>

          </tr>
        `;


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "get_teacher_student_list"
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


        /* ===============================================
           เรียงนักเรียนตาม
           ห้อง → เลขที่ → รหัสนักเรียน
        =============================================== */

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
              classCompare !== 0
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


            if (
              numberA !== numberB
            ) {

              return (
                numberA
                -
                numberB
              );

            }


            return String(
              a.student_id
              ??
              ""
            )
            .localeCompare(
              String(
                b.student_id
                ??
                ""
              )
            );

          }
        );


        buildClassFilter();


        renderPage();


      }

      catch (
        error
      ) {


        console.error(
          "Teacher Class Error:",
          error
        );


        tableBody.innerHTML =
          `
            <tr>

              <td
                colspan="7"
                class="teacher-table-message"
                style="
                  color:#ff2e91 !important;
                "
              >
                ไม่สามารถโหลดข้อมูลได้
              </td>

            </tr>
          `;


        studentCount.textContent =
          "0 คน";

      }

      finally {


        refreshButton.disabled =
          false;


        refreshButton.textContent =
          "↻ REFRESH";

      }

    }


    /* =====================================================
       CLASS NUMBER
       ตัวอย่าง:
       ม.2/3  → 3
       ม.2/10 → 10
    ===================================================== */

    function getRoomNumber(
      className
    ) {


      if (
        !className
      ) {

        return 9999;

      }


      const text =
        String(
          className
        )
        .trim();


      const parts =
        text.split(
          "/"
        );


      if (
        parts.length < 2
      ) {

        return 9999;

      }


      const room =
        Number(
          parts[
            parts.length - 1
          ]
        );


      if (
        Number.isNaN(
          room
        )
      ) {

        return 9999;

      }


      return room;

    }


    /* =====================================================
       COMPARE CLASS NAMES
    ===================================================== */

    function compareClassNames(
      classA,
      classB
    ) {


      const roomA =
        getRoomNumber(
          classA
        );


      const roomB =
        getRoomNumber(
          classB
        );


      if (
        roomA !== roomB
      ) {

        return (
          roomA
          -
          roomB
        );

      }


      return String(
        classA
        ??
        ""
      )
      .localeCompare(
        String(
          classB
          ??
          ""
        ),
        "th"
      );

    }


    /* =====================================================
       BUILD CLASS FILTER

       ดึงเฉพาะห้องที่มีจริงจากฐานข้อมูล
       และเรียงตามเลขห้อง
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
        "";


      /* ===============================================
         ALL CLASSROOMS
      =============================================== */

      const allOption =
        document.createElement(
          "option"
        );


      allOption.value =
        "";


      allOption.textContent =
        "ทุกห้องเรียน";


      classFilter.appendChild(
        allOption
      );


      /* ===============================================
         CLASSROOM OPTIONS
      =============================================== */

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


      /* ===============================================
         RESTORE SELECTED CLASS
      =============================================== */

      if (
        classes.includes(
          oldValue
        )
      ) {

        classFilter.value =
          oldValue;

      }


      console.log(
        "Teacher Classrooms:",
        classes
      );

    }


    /* =====================================================
       FILTERED STUDENTS
    ===================================================== */

    function getFilteredStudents() {


      const className =
        classFilter
          .value
          .trim();


      const account =
        accountFilter
          .value
          .trim();


      const keyword =
        searchInput
          .value
          .trim()
          .toLowerCase();


      return students.filter(
        function (
          student
        ) {


          /* =============================================
             CLASS
          ============================================= */

          if (
            className
            &&
            student.class_name !==
            className
          ) {

            return false;

          }


          /* =============================================
             ACCOUNT STATUS
          ============================================= */

          if (
            account ===
            "inactive"
            &&
            student.is_active ===
            true
          ) {

            return false;

          }


          if (
            account ===
            "active"
            &&
            student.is_active !==
            true
          ) {

            return false;

          }


          if (
            account ===
            "password"
            &&
            student.must_change_password !==
            true
          ) {

            return false;

          }


          /* =============================================
             SEARCH
          ============================================= */

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
       DARE COMPLETE
    ===================================================== */

    function isDareComplete(
      student
    ) {


      return (

        student.discover_completed ===
        true

        &&

        student.analyze_completed ===
        true

        &&

        student.reason_completed ===
        true

        &&

        student.evolve_completed ===
        true

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
       SUMMARY
    ===================================================== */

    function renderSummary() {


      /*
        Summary เปลี่ยนตามห้องที่เลือก
        แต่ไม่เปลี่ยนตามช่องค้นหา
        เพื่อให้เห็นภาพรวมของห้อง
      */

      const selectedClass =
        classFilter.value;


      const current =
        students.filter(
          function (
            student
          ) {


            if (
              !selectedClass
            ) {

              return true;

            }


            return (
              student.class_name ===
              selectedClass
            );

          }
        );


      const totalElement =
        document.getElementById(
          "classTotalStudents"
        );


      const activeElement =
        document.getElementById(
          "classActiveStudents"
        );


      const passwordElement =
        document.getElementById(
          "classPasswordPending"
        );


      const dareElement =
        document.getElementById(
          "classDareComplete"
        );


      if (
        totalElement
      ) {

        totalElement.textContent =
          current.length;

      }


      if (
        activeElement
      ) {

        activeElement.textContent =
          current.filter(
            function (
              student
            ) {

              return (
                student.is_active ===
                true
              );

            }
          ).length;

      }


      if (
        passwordElement
      ) {

        passwordElement.textContent =
          current.filter(
            function (
              student
            ) {

              return (
                student.must_change_password ===
                true
              );

            }
          ).length;

      }


      if (
        dareElement
      ) {

        dareElement.textContent =
          current.filter(
            isDareComplete
          ).length;

      }

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
                colspan="7"
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


          /* =============================================
             ACCOUNT STATUS
          ============================================= */

          let accountHTML;


          if (
            student.is_active !==
            true
          ) {


            accountHTML =
              `
                <span
                  class="
                    teacher-account-status
                    teacher-account-inactive
                  "
                >
                  INACTIVE
                </span>
              `;


          }

          else if (
            student.must_change_password ===
            true
          ) {


            accountHTML =
              `
                <span
                  class="
                    teacher-account-status
                    teacher-account-password
                  "
                >
                  NEW PASSWORD
                </span>
              `;


          }

          else {


            accountHTML =
              `
                <span
                  class="
                    teacher-account-status
                    teacher-account-active
                  "
                >
                  ACTIVE
                </span>
              `;

          }


          /* =============================================
             DARE STATUS
          ============================================= */

          const dareHTML =
            `
              <div class="teacher-dare-mini">

                <span
                  class="${
                    student.discover_completed
                      ?
                      "complete"
                      :
                      ""
                  }"
                  title="Discover"
                >
                  D
                </span>


                <span
                  class="${
                    student.analyze_completed
                      ?
                      "complete"
                      :
                      ""
                  }"
                  title="Analyze"
                >
                  A
                </span>


                <span
                  class="${
                    student.reason_completed
                      ?
                      "complete"
                      :
                      ""
                  }"
                  title="Reason"
                >
                  R
                </span>


                <span
                  class="${
                    student.evolve_completed
                      ?
                      "complete"
                      :
                      ""
                  }"
                  title="Evolve"
                >
                  E
                </span>

              </div>
            `;


          /* =============================================
             ROW
          ============================================= */

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
                ${accountHTML}
              </td>


              <td>
                ${dareHTML}
              </td>


<td>

  <div class="teacher-action-buttons">

    <button
      type="button"
      class="
        teacher-reset-button
        reset-password-button
      "
    >
      RESET PASSWORD
    </button>


    <button
      type="button"
      class="
        teacher-progress-reset-button
      "
    >
      RESET PROGRESS
    </button>

  </div>

</td>

            `;


/* =============================================
   PASSWORD RESET BUTTON
============================================= */

const resetPasswordButton =
  row.querySelector(
    ".reset-password-button"
  );


if (
  resetPasswordButton
) {

  resetPasswordButton.addEventListener(
    "click",
    function () {

      openPasswordModal(
        student
      );

    }
  );

}


/* =============================================
   PROGRESS RESET BUTTON
============================================= */

const resetProgressButton =
  row.querySelector(
    ".teacher-progress-reset-button"
  );


if (
  resetProgressButton
) {

  resetProgressButton.addEventListener(
    "click",
    function () {

      openProgressResetModal(
        student
      );

    }
  );

}
          /* =============================================
             ADD ROW TO TABLE
          ============================================= */

          tableBody.appendChild(
            row
          );

        }
      );

    }

    /* =====================================================
       OPEN RESET PASSWORD MODAL
    ===================================================== */

    function openPasswordModal(
      student
    ) {


      if (
        !modal
      ) {

        return;

      }


      selectedStudent =
        student;


      if (
        resetStudentName
      ) {

        resetStudentName.textContent =
          student.student_name
          ||
          "-";

      }


      if (
        resetStudentId
      ) {

        resetStudentId.textContent =
          "ID : "
          +
          (
            student.student_id
            ||
            "-"
          );

      }


      if (
        temporaryPassword
      ) {

        temporaryPassword.textContent =
          "------";

      }


      if (
        passwordResetConfirm
      ) {

        passwordResetConfirm.classList.remove(
          "teacher-hidden"
        );

      }


      if (
        temporaryPasswordPanel
      ) {

        temporaryPasswordPanel.classList.add(
          "teacher-hidden"
        );

      }


      modal.classList.remove(
        "teacher-hidden"
      );

    }


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closePasswordModal() {


      if (
        modal
      ) {

        modal.classList.add(
          "teacher-hidden"
        );

      }


      selectedStudent =
        null;

    }


    if (
      closeModalButton
    ) {

      closeModalButton.addEventListener(
        "click",
        closePasswordModal
      );

    }


    if (
      modal
    ) {


      const backdrop =
        modal.querySelector(
          ".teacher-modal-backdrop"
        );


      if (
        backdrop
      ) {

        backdrop.addEventListener(
          "click",
          closePasswordModal
        );

      }

    }
/* =====================================================
   RESET PASSWORD
===================================================== */

if (
  confirmResetButton
) {

  confirmResetButton.addEventListener(
    "click",
    async function () {


      if (
        !selectedStudent
      ) {

        return;

      }


      /* ===============================================
         GET TEACHER SESSION TOKEN
      =============================================== */

      const teacherSessionToken =
        localStorage.getItem(
          "teacherSessionToken"
        );


      if (
        !teacherSessionToken
      ) {

        alert(
          "Teacher Session หมดอายุ กรุณาเข้าสู่ระบบใหม่"
        );

        window.location.href =
          "../index.html";

        return;

      }


      /* ===============================================
         BUTTON LOADING
      =============================================== */

      const oldText =
        confirmResetButton.textContent;


      confirmResetButton.disabled =
        true;


      confirmResetButton.textContent =
        "GENERATING...";


      try {


        /* =============================================
           CALL SUPABASE
        ============================================= */

        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "teacher_reset_student_password",
            {

              p_session_token:
                teacherSessionToken,

              p_student_id:
                selectedStudent.student_id

            }
          );


        if (
          error
        ) {

          throw error;

        }


        /* =============================================
           CHECK RESULT
        ============================================= */

        if (
          !data
          ||
          data.length === 0
        ) {

          throw new Error(
            "ไม่พบผลลัพธ์จากระบบ"
          );

        }


        const result =
          data[0];


        if (
          result.success !==
          true
        ) {

          throw new Error(
            result.message
            ||
            "RESET PASSWORD FAILED"
          );

        }


        /* =============================================
           SHOW TEMPORARY PASSWORD
        ============================================= */

        if (
          temporaryPassword
        ) {

          temporaryPassword.textContent =
            result.temporary_password
            ||
            "------";

        }


        if (
          passwordResetConfirm
        ) {

          passwordResetConfirm.classList.add(
            "teacher-hidden"
          );

        }


        if (
          temporaryPasswordPanel
        ) {

          temporaryPasswordPanel.classList.remove(
            "teacher-hidden"
          );

        }


        /* =============================================
           RELOAD STUDENT DATA
        ============================================= */

        await loadStudents();


      }

      catch (
        error
      ) {


        console.error(
          "Reset Password Error:",
          error
        );


        alert(
          "ไม่สามารถรีเซ็ตรหัสผ่านได้\n\n"
          +
          (
            error.message
            ||
            "เกิดข้อผิดพลาด"
          )
        );

      }

      finally {


        confirmResetButton.disabled =
          false;


        confirmResetButton.textContent =
          oldText;

      }

    }
  );

}
    /* =====================================================
       COPY TEMP PASSWORD
    ===================================================== */

    if (
      copyPasswordButton
    ) {

      copyPasswordButton.addEventListener(
        "click",
        async function () {


          if (
            !temporaryPassword
          ) {

            return;

          }


          const password =
            temporaryPassword
              .textContent
              .trim();


          if (
            !password
            ||
            password ===
            "------"
          ) {

            return;

          }


          try {


            await navigator.clipboard.writeText(
              password
            );


            const oldText =
              copyPasswordButton.textContent;


            copyPasswordButton.textContent =
              "✓ COPIED";


            setTimeout(
              function () {


                copyPasswordButton.textContent =
                  oldText;

              },
              1500
            );


          }

          catch (
            error
          ) {


            console.error(
              "Clipboard Error:",
              error
            );


            alert(
              "ไม่สามารถคัดลอกรหัสผ่านได้ กรุณาคัดลอกด้วยตนเอง"
            );

          }

        }
      );

    }
/* =====================================================
   OPEN PROGRESS RESET MODAL
===================================================== */

function openProgressResetModal(
  student
) {


  if (
    !progressResetModal
  ) {

    return;

  }


  selectedStudent =
    student;


  if (
    progressResetStudentName
  ) {

    progressResetStudentName.textContent =
      student.student_name
      ||
      "-";

  }


  if (
    progressResetStudentInfo
  ) {

    progressResetStudentInfo.textContent =
      "ID "
      +
      (
        student.student_id
        ||
        "-"
      )
      +
      " • "
      +
      (
        student.class_name
        ||
        "-"
      )
      +
      " • เลขที่ "
      +
      (
        student.student_number
        ??
        "-"
      );

  }


  if (
    progressResetMessage
  ) {

    progressResetMessage.textContent =
      "";

  }


  document
    .querySelectorAll(
      'input[name="progressResetScope"]'
    )
    .forEach(
      function (
        radio
      ) {

        radio.checked =
          false;

      }
    );


  progressResetModal.classList.remove(
    "teacher-hidden"
  );

}


/* =====================================================
   CLOSE PROGRESS RESET MODAL
===================================================== */

function closeProgressResetModal() {


  if (
    progressResetModal
  ) {

    progressResetModal.classList.add(
      "teacher-hidden"
    );

  }


  selectedStudent =
    null;


  if (
    progressResetMessage
  ) {

    progressResetMessage.textContent =
      "";

  }

}


/* =====================================================
   PROGRESS MODAL CLOSE EVENTS
===================================================== */

if (
  closeProgressResetModalButton
) {

  closeProgressResetModalButton.addEventListener(
    "click",
    closeProgressResetModal
  );

}


if (
  cancelProgressResetButton
) {

  cancelProgressResetButton.addEventListener(
    "click",
    closeProgressResetModal
  );

}


if (
  progressResetBackdrop
) {

  progressResetBackdrop.addEventListener(
    "click",
    closeProgressResetModal
  );

}


/* =====================================================
   CONFIRM RESET PROGRESS
===================================================== */

if (
  confirmProgressResetButton
) {

  confirmProgressResetButton.addEventListener(
    "click",
    async function () {


      if (
        !selectedStudent
      ) {

        return;

      }


      /* ===============================================
         SELECT RESET SCOPE
      =============================================== */

      const selectedScope =
        document.querySelector(
          'input[name="progressResetScope"]:checked'
        );


      if (
        !selectedScope
      ) {

        if (
          progressResetMessage
        ) {

          progressResetMessage.textContent =
            "กรุณาเลือกขั้นที่ต้องการรีเซ็ต";


          progressResetMessage.style.color =
            "#ffd21a";

        }


        return;

      }


      const scope =
        selectedScope.value;


      /* ===============================================
         TEACHER TOKEN
      =============================================== */

      const teacherSessionToken =
        localStorage.getItem(
          "teacherSessionToken"
        );


      if (
        !teacherSessionToken
      ) {

        alert(
          "ไม่พบ Teacher Session กรุณาเข้าสู่ระบบใหม่"
        );


        window.location.href =
          "../index.html";


        return;

      }


      /* ===============================================
         DISPLAY NAME
      =============================================== */

      let scopeName =
        scope;


      if (
        scope === "D"
      ) {

        scopeName =
          "Discover และขั้นถัดไปทั้งหมด";

      }


      else if (
        scope === "A"
      ) {

        scopeName =
          "Analyze และขั้นถัดไปทั้งหมด";

      }


      else if (
        scope === "R"
      ) {

        scopeName =
          "Reason และ Evolve";

      }


      else if (
        scope === "E"
      ) {

        scopeName =
          "Evolve";

      }


      else if (
        scope === "ALL"
      ) {

        scopeName =
          "DARE ทั้งหมด";

      }


      /* ===============================================
         CONFIRM
      =============================================== */

      const confirmed =
        window.confirm(

          "ยืนยันการรีเซ็ต "
          +
          scopeName
          +
          "\n\nนักเรียน: "
          +
          selectedStudent.student_name
          +
          "\nรหัส: "
          +
          selectedStudent.student_id
          +
          "\n\nข้อมูลคะแนนและความก้าวหน้าจะถูกรีเซ็ต"

        );


      if (
        !confirmed
      ) {

        return;

      }


      const oldText =
        confirmProgressResetButton.textContent;


      confirmProgressResetButton.disabled =
        true;


      confirmProgressResetButton.textContent =
        "RESETTING...";


      if (
        progressResetMessage
      ) {

        progressResetMessage.textContent =
          "กำลังรีเซ็ตข้อมูล...";


        progressResetMessage.style.color =
          "#ffd21a";

      }


      try {


        /* =============================================
           CALL SUPABASE
        ============================================= */

        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "teacher_reset_student_progress",
            {

              p_session_token:
                teacherSessionToken,

              p_student_id:
                selectedStudent.student_id,

              p_reset_scope:
                scope

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

          throw new Error(
            "ไม่พบผลลัพธ์จากการรีเซ็ต"
          );

        }


        const result =
          data[0];


        if (
          result.success !==
          true
        ) {

          throw new Error(
            result.message
            ||
            "RESET FAILED"
          );

        }


        /* =============================================
           CLEAR E • REFLECTION V2

           Reflection รุ่นใหม่เก็บแยกใน
           evolve_reflections_v2 จึงต้องลบพร้อม RESET
        ============================================= */

        const {
          data: reflectionResetData,
          error: reflectionResetError
        } = await supabaseClient.rpc(
          "teacher_clear_evolve_reflection_v2",
          {
            p_session_token:
              teacherSessionToken,

            p_student_id:
              selectedStudent.student_id
          }
        );


        if (
          reflectionResetError
        ) {

          throw reflectionResetError;

        }


        if (
          !reflectionResetData
          ||
          reflectionResetData.length === 0
          ||
          reflectionResetData[0].success !== true
        ) {

          throw new Error(
            reflectionResetData?.[0]?.message
            ||
            "REFLECTION RESET FAILED"
          );

        }


        /* =============================================
           SUCCESS
        ============================================= */

        if (
          progressResetMessage
        ) {

          progressResetMessage.textContent =
            "✓ "
            +
            (
              result.message
              ||
              "รีเซ็ตเรียบร้อยแล้ว"
            );


          progressResetMessage.style.color =
            "#2cff8c";

        }


        /*
          โหลดสถานะ D A R E ใหม่
        */

        await loadStudents();


        setTimeout(
          function () {

            closeProgressResetModal();

          },
          900
        );


      }

      catch (
        error
      ) {


        console.error(
          "Reset Student Progress Error:",
          error
        );


        if (
          progressResetMessage
        ) {

          progressResetMessage.textContent =
            "ไม่สามารถรีเซ็ตได้: "
            +
            (
              error.message
              ||
              "เกิดข้อผิดพลาด"
            );


          progressResetMessage.style.color =
            "#ff759e";

        }

      }

      finally {


        confirmProgressResetButton.disabled =
          false;


        confirmProgressResetButton.textContent =
          oldText;

      }

    }
  );

}

    /* =====================================================
       FILTER EVENTS
    ===================================================== */

    classFilter.addEventListener(
      "change",
      function () {


        renderSummary();


        renderTable();

      }
    );


    accountFilter.addEventListener(
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


    /* =====================================================
       REFRESH
    ===================================================== */

    refreshButton.addEventListener(
      "click",
      loadStudents
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
       START
    ===================================================== */

    await loadStudents();


  }
);