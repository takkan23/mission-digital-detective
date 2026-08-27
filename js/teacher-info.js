/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER • E EVOLVE
   INFO MISSION ASSESSMENT
========================================================= */

console.log(
  "### TEACHER EVOLVE V4 LOADED ###"
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


    let selectedStudent =
      null;


    /* =====================================================
       FILTER ELEMENTS
    ===================================================== */

    const classFilter =
      document.getElementById(
        "evolveClassFilter"
      );


    const statusFilter =
      document.getElementById(
        "evolveStatusFilter"
      );


    const searchInput =
      document.getElementById(
        "evolveStudentSearch"
      );


    const refreshButton =
      document.getElementById(
        "evolveRefreshButton"
      );


    /* =====================================================
       SUMMARY ELEMENTS
    ===================================================== */

    const totalStudents =
      document.getElementById(
        "evolveTotalStudents"
      );


    const unlockedStudents =
      document.getElementById(
        "evolveUnlockedStudents"
      );


    const waitingStudents =
      document.getElementById(
        "evolveWaitingStudents"
      );


    const passedStudents =
      document.getElementById(
        "evolvePassedStudents"
      );


    const failedStudents =
      document.getElementById(
        "evolveFailedStudents"
      );


    const progressCount =
      document.getElementById(
        "evolveProgressCount"
      );


    const progressBar =
      document.getElementById(
        "evolveMainProgressBar"
      );


    /* =====================================================
       TABLE ELEMENTS
    ===================================================== */

    const studentCount =
      document.getElementById(
        "evolveStudentCount"
      );


    const tableBody =
      document.getElementById(
        "evolveStudentTableBody"
      );


    /* =====================================================
       MODAL ELEMENTS
    ===================================================== */

    const modal =
      document.getElementById(
        "evolveAssessmentModal"
      );


    const backdrop =
      document.getElementById(
        "evolveAssessmentBackdrop"
      );


    const closeModalButton =
      document.getElementById(
        "closeEvolveAssessmentModal"
      );


    const cancelButton =
      document.getElementById(
        "cancelEvolveAssessmentButton"
      );


    const saveButton =
      document.getElementById(
        "saveEvolveAssessmentButton"
      );


    const modalStudentName =
      document.getElementById(
        "evolveAssessmentStudentName"
      );


    const modalStudentInfo =
      document.getElementById(
        "evolveAssessmentStudentInfo"
      );


    const assessmentMessage =
      document.getElementById(
        "evolveAssessmentMessage"
      );


    /* =====================================================
       SUBMISSION ELEMENTS
    ===================================================== */

    const submissionLink =
      document.getElementById(
        "evolveSubmissionLink"
      );


    const submissionUrlText =
      document.getElementById(
        "evolveSubmissionUrlText"
      );


    /* =====================================================
       SCORE ELEMENTS
    ===================================================== */

    const score1 =
      document.getElementById(
        "evolveScore1"
      );


    const score2 =
      document.getElementById(
        "evolveScore2"
      );


    const score3 =
      document.getElementById(
        "evolveScore3"
      );


    const score4 =
      document.getElementById(
        "evolveScore4"
      );


    const previewTotal =
      document.getElementById(
        "evolvePreviewTotal"
      );


    const previewLevel =
      document.getElementById(
        "evolvePreviewLevel"
      );


    const previewResult =
      document.getElementById(
        "evolvePreviewResult"
      );


    /* =====================================================
       REQUIRED ELEMENT CHECK
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
      ||
      !modal
    ) {

      console.error(
        "Teacher Evolve: ไม่พบ Element ที่จำเป็น"
      );

      return;

    }


    /* =====================================================
       ROOM NUMBER
    ===================================================== */

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


    /* =====================================================
       CLASS SORT
    ===================================================== */

    function compareClassNames(
      a,
      b
    ) {


      return (
        getRoomNumber(
          a
        )
        -
        getRoomNumber(
          b
        )
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
              colspan="11"
              class="teacher-table-message"
            >
              กำลังโหลดข้อมูล Evolve...
            </td>

          </tr>
        `;


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "get_teacher_evolve_students"
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


            if (
              numberA !==
              numberB
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


        console.log(
          "Evolve students:",
          students.length
        );


      }

      catch (
        error
      ) {


        console.error(
          "Teacher Evolve Error:",
          error
        );


        tableBody.innerHTML =
          `
            <tr>

              <td
                colspan="11"
                class="teacher-table-message"
                style="
                  color:#ff5ca8 !important;
                "
              >
                ไม่สามารถโหลดข้อมูล Evolve ได้
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
       CURRENT CLASS STUDENTS
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
       EVOLVE STATUS
    ===================================================== */

    function getEvolveStatus(
      student
    ) {


      if (
        student.evolve_teacher_checked ===
        true
      ) {

        return (
          student.evolve_passed ===
          true
        )
        ?
        "passed"
        :
        "failed";

      }


      if (
        student.evolve_submitted ===
        true
      ) {

        return "submitted";

      }


      if (
        student.evolve_unlocked ===
        true
      ) {

        return "ready";

      }


      return "locked";

    }


    /* =====================================================
       FILTER STUDENTS
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


          if (
            status
            &&
            getEvolveStatus(
              student
            )
            !==
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
       SUMMARY
    ===================================================== */

    function renderSummary() {


      const current =
        getClassStudents();


      const total =
        current.length;


      const unlocked =
        current.filter(
          function (
            student
          ) {

            return (
              student.evolve_unlocked ===
              true
            );

          }
        )
        .length;


      const waiting =
        current.filter(
          function (
            student
          ) {

            return (
              student.evolve_submitted ===
              true
              &&
              student.evolve_teacher_checked !==
              true
            );

          }
        )
        .length;


      const passed =
        current.filter(
          function (
            student
          ) {

            return (
              student.evolve_teacher_checked ===
              true
              &&
              student.evolve_passed ===
              true
            );

          }
        )
        .length;


      const failed =
        current.filter(
          function (
            student
          ) {

            return (
              student.evolve_teacher_checked ===
              true
              &&
              student.evolve_passed !==
              true
            );

          }
        )
        .length;


      const checked =
        current.filter(
          function (
            student
          ) {

            return (
              student.evolve_teacher_checked ===
              true
            );

          }
        )
        .length;


      const checkedPercent =
        total ===
        0
        ?
        0
        :
        Math.round(
          checked
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
        unlockedStudents
      ) {

        unlockedStudents.textContent =
          unlocked;

      }


      if (
        waitingStudents
      ) {

        waitingStudents.textContent =
          waiting;

      }


      if (
        passedStudents
      ) {

        passedStudents.textContent =
          passed;

      }


      if (
        failedStudents
      ) {

        failedStudents.textContent =
          failed;

      }


      if (
        progressCount
      ) {

        progressCount.textContent =
          checked
          +
          " / "
          +
          total;

      }


      if (
        progressBar
      ) {

        progressBar.style.width =
          checkedPercent
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
        unlockedStudents
      ) {

        unlockedStudents.textContent =
          "0";

      }


      if (
        waitingStudents
      ) {

        waitingStudents.textContent =
          "0";

      }


      if (
        passedStudents
      ) {

        passedStudents.textContent =
          "0";

      }


      if (
        failedStudents
      ) {

        failedStudents.textContent =
          "0";

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
       DARE MINI STATUS
    ===================================================== */

    function buildDareHTML(
      student
    ) {


      const dComplete =
        student.discover_completed ===
        true;


      const aComplete =
        student.analyze_completed ===
        true;


      const rComplete =
        student.reason_completed ===
        true;


      return `
        <div class="teacher-dare-mini">

          <span
            class="${dComplete ? "complete" : ""}"
            title="Discover"
          >
            D
          </span>

          <span
            class="${aComplete ? "complete" : ""}"
            title="Analyze"
          >
            A
          </span>

          <span
            class="${rComplete ? "complete" : ""}"
            title="Reason"
          >
            R
          </span>

        </div>
      `;

    }


    /* =====================================================
       QUALITY NAME
    ===================================================== */

    function getQualityName(
      level
    ) {


      level =
        Number(
          level
        );


      if (
        level ===
        4
      ) {

        return "ดีเยี่ยม";

      }


      if (
        level ===
        3
      ) {

        return "ดี";

      }


      if (
        level ===
        2
      ) {

        return "พอใช้";

      }


      if (
        level ===
        1
      ) {

        return "ควรปรับปรุง";

      }


      return "-";

    }


    /* =====================================================
       TABLE
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
                colspan="11"
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


          const checked =
            student.evolve_teacher_checked ===
            true;


          const submitted =
            student.evolve_submitted ===
            true;


          const unlocked =
            student.evolve_unlocked ===
            true;


          /* =============================================
             ACCESS
          ============================================= */

          const accessHTML =
            unlocked
            ?
            `
              <span
                class="
                  teacher-discover-status
                  completed
                "
              >
                🔓 AUTO OPEN
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
                🔒 LOCKED
              </span>
            `;


          /* =============================================
             SUBMISSION
          ============================================= */

          const submissionHTML =
            submitted
            ?
            `
              <span class="teacher-green">
                ✓ ส่งแล้ว
              </span>
            `
            :
            `
              <span class="teacher-yellow">
                ยังไม่ส่ง
              </span>
            `;


          /* =============================================
             SCORE
          ============================================= */

          const scoreHTML =
            checked
            ?
            `
              <strong class="teacher-green">
                ${escapeHTML(
                  student.evolve_score
                  ??
                  0
                )} / 16
              </strong>
            `
            :
            `
              <span class="teacher-muted">
                -
              </span>
            `;


          /* =============================================
             QUALITY
          ============================================= */

          const qualityHTML =
            checked
            ?
            `
              <span>
                ${escapeHTML(
                  student.evolve_quality_level
                  ??
                  0
                )}
                •
                ${escapeHTML(
                  getQualityName(
                    student.evolve_quality_level
                  )
                )}
              </span>
            `
            :
            `
              <span class="teacher-muted">
                -
              </span>
            `;


          /* =============================================
             RESULT
          ============================================= */

          const resultHTML =
            checked
            ?
            (
              student.evolve_passed ===
              true
              ?
              `
                <span
                  class="
                    teacher-discover-status
                    completed
                  "
                >
                  ✓ ผ่าน
                </span>
              `
              :
              `
                <span
                  class="
                    teacher-analyze-result
                    failed
                  "
                >
                  ✕ ไม่ผ่าน
                </span>
              `
            )
            :
            `
              <span class="teacher-muted">
                -
              </span>
            `;


          /* =============================================
             ACTION
          ============================================= */

          let actionHTML;


          if (
            submitted
          ) {

            actionHTML =
              `
                <button
                  type="button"
                  class="teacher-evolve-assess-button"
                >
                  ${
                    checked
                    ?
                    "แก้ไขคะแนน"
                    :
                    "ตรวจชิ้นงาน"
                  }
                </button>
              `;

          }

          else {

            actionHTML =
              `
                <button
                  type="button"
                  class="
                    teacher-evolve-assess-button
                    disabled
                  "
                  disabled
                >
                  รอส่งงาน
                </button>
              `;

          }


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
                ${buildDareHTML(
                  student
                )}
              </td>


              <td>
                ${accessHTML}
              </td>


              <td>
                ${submissionHTML}
              </td>


              <td>
                ${scoreHTML}
              </td>


              <td>
                ${qualityHTML}
              </td>


              <td>
                ${resultHTML}
              </td>


              <td>
                ${actionHTML}
              </td>

            `;


          const assessButton =
            row.querySelector(
              ".teacher-evolve-assess-button:not(.disabled)"
            );


          if (
            assessButton
          ) {

            assessButton.addEventListener(
              "click",
              function () {

                openAssessmentModal(
                  student
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
       RUBRIC CLICK SETUP
    ===================================================== */

    function setupRubricButtons() {


      document
        .querySelectorAll(
          ".teacher-evolve-rubric-item"
        )
        .forEach(
          function (
            item
          ) {


            const targetId =
              item.dataset.scoreTarget;


            if (
              !targetId
            ) {

              return;

            }


            const targetInput =
              document.getElementById(
                targetId
              );


            const buttons =
              item.querySelectorAll(
                ".teacher-rubric-level"
              );


            buttons.forEach(
              function (
                button
              ) {


                button.addEventListener(
                  "click",
                  function () {


                    buttons.forEach(
                      function (
                        currentButton
                      ) {

                        currentButton.classList.remove(
                          "selected"
                        );

                      }
                    );


                    button.classList.add(
                      "selected"
                    );


                    if (
                      targetInput
                    ) {

                      targetInput.value =
                        button.dataset.score
                        ||
                        "";

                    }


                    updatePreview();

                  }
                );

              }
            );

          }
        );

    }


    /* =====================================================
       SYNC SELECTED CARDS
    ===================================================== */

    function syncSelectedCards() {


      document
        .querySelectorAll(
          ".teacher-evolve-rubric-item"
        )
        .forEach(
          function (
            item
          ) {


            const targetId =
              item.dataset.scoreTarget;


            const targetInput =
              document.getElementById(
                targetId
              );


            const selectedScore =
              String(
                targetInput?.value
                ||
                ""
              );


            item
              .querySelectorAll(
                ".teacher-rubric-level"
              )
              .forEach(
                function (
                  button
                ) {


                  button.classList.toggle(
                    "selected",
                    String(
                      button.dataset.score
                    )
                    ===
                    selectedScore
                  );

                }
              );

          }
        );

    }


    /* =====================================================
       OPEN ASSESSMENT MODAL
    ===================================================== */

async function openAssessmentModal(
  student
) {

  selectedStudent =
    student;


  /* ===============================================
     STUDENT INFO
  =============================================== */

  if (
    modalStudentName
  ) {

    modalStudentName.textContent =
      student.student_name
      ||
      "-";

  }


  if (
    modalStudentInfo
  ) {

    modalStudentInfo.textContent =
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


  /* ===============================================
     EXISTING SCORES
  =============================================== */

  score1.value =
    student.evolve_score_1
    ??
    "";


  score2.value =
    student.evolve_score_2
    ??
    "";


  score3.value =
    student.evolve_score_3
    ??
    "";


  score4.value =
    student.evolve_score_4
    ??
    "";


  /* ===============================================
     RESET SUBMISSION LINK
  =============================================== */

  if (
    submissionLink
  ) {

    submissionLink.href =
      "#";

    submissionLink.classList.add(
      "teacher-hidden"
    );

  }


  if (
    submissionUrlText
  ) {

    submissionUrlText.textContent =
      "กำลังโหลดลิงก์ชิ้นงาน...";

  }


  /* ===============================================
     RESET MESSAGE
  =============================================== */

  if (
    assessmentMessage
  ) {

    assessmentMessage.textContent =
      "";

  }


  /* ===============================================
     OPEN MODAL FIRST
  =============================================== */

  syncSelectedCards();

  updatePreview();


  modal.classList.remove(
    "teacher-hidden"
  );


  const modalCard =
    modal.querySelector(
      ".teacher-evolve-assessment-modal"
    );


  if (
    modalCard
  ) {

    modalCard.scrollTop =
      0;

  }


  /* ===============================================
     LOAD STUDENT SUBMISSION
  =============================================== */

  try {

const teacherSessionToken =
  localStorage.getItem(
    "teacherSessionToken"
  );


if (
  !teacherSessionToken
) {

  throw new Error(
    "ไม่พบ Teacher Session"
  );

}


const {
  data: submissionRows,
  error: submissionError
} =
  await supabaseClient.rpc(
    "teacher_get_evolve_submission",
    {

      p_session_token:
        teacherSessionToken,

      p_student_id:
        student.student_id

    }
  );


if (
  submissionError
) {

  throw submissionError;

}


const submissionData =
  Array.isArray(
    submissionRows
  )
  &&
  submissionRows.length > 0
    ?
    submissionRows[0]
    :
    null;

    if (
      submissionError
    ) {

      throw submissionError;

    }


    console.log(
      "EVOLVE SUBMISSION:",
      submissionData
    );


    const submissionUrl =
      submissionData?.work_link
      ||
      "";


    /* =============================================
       FOUND LINK
    ============================================= */

    if (
      submissionUrl
    ) {

      if (
        submissionLink
      ) {

        submissionLink.href =
          submissionUrl;

        submissionLink.target =
          "_blank";

        submissionLink.rel =
          "noopener noreferrer";

        submissionLink.classList.remove(
          "teacher-hidden"
        );

      }


      if (
        submissionUrlText
      ) {

        submissionUrlText.textContent =
          submissionUrl;

      }

    }


    /* =============================================
       NO LINK
    ============================================= */

    else {

      if (
        submissionLink
      ) {

        submissionLink.href =
          "#";

        submissionLink.classList.add(
          "teacher-hidden"
        );

      }


      if (
        submissionUrlText
      ) {

        submissionUrlText.textContent =
          "ยังไม่พบลิงก์ชิ้นงาน";

      }

    }

  }

  catch (
    error
  ) {

    console.error(
      "Load Evolve Submission Error:",
      error
    );


    if (
      submissionUrlText
    ) {

      submissionUrlText.textContent =
        "ไม่สามารถโหลดลิงก์ชิ้นงานได้";

    }

  }

}
    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    function closeAssessmentModal() {


      modal.classList.add(
        "teacher-hidden"
      );


      selectedStudent =
        null;


      if (
        assessmentMessage
      ) {

        assessmentMessage.textContent =
          "";

      }

    }


    /* =====================================================
       PREVIEW SCORE
    ===================================================== */

    function updatePreview() {


      const values =
        [
          score1.value,
          score2.value,
          score3.value,
          score4.value
        ];


      const complete =
        values.every(
          function (
            value
          ) {

            return (
              value !==
              ""
            );

          }
        );


      if (
        !complete
      ) {

        previewTotal.textContent =
          "0 / 16";


        previewLevel.textContent =
          "-";


        previewResult.textContent =
          "-";


        previewResult.style.color =
          "";


        return;

      }


      const total =
        values.reduce(
          function (
            sum,
            value
          ) {

            return (
              sum
              +
              Number(
                value
              )
            );

          },
          0
        );


      let level;


      if (
        total >=
        14
      ) {

        level =
          4;

      }

      else if (
        total >=
        12
      ) {

        level =
          3;

      }

      else if (
        total >=
        9
      ) {

        level =
          2;

      }

      else {

        level =
          1;

      }


      const passed =
        total >=
        12;


      previewTotal.textContent =
        total
        +
        " / 16";


      previewLevel.textContent =
        level
        +
        " • "
        +
        getQualityName(
          level
        );


      previewResult.textContent =
        passed
        ?
        "ผ่าน"
        :
        "ไม่ผ่าน";


      previewResult.style.color =
        passed
        ?
        "#2cff8c"
        :
        "#ff5ca8";

    }


    /* =====================================================
       SAVE ASSESSMENT
    ===================================================== */

    async function saveAssessment() {


      if (
        !selectedStudent
      ) {

        return;

      }


      const value1 =
        Number(
          score1.value
        );


      const value2 =
        Number(
          score2.value
        );


      const value3 =
        Number(
          score3.value
        );


      const value4 =
        Number(
          score4.value
        );


      if (
        !value1
        ||
        !value2
        ||
        !value3
        ||
        !value4
      ) {

        assessmentMessage.textContent =
          "กรุณาเลือกคะแนนให้ครบทั้ง 4 ด้าน";


        assessmentMessage.style.color =
          "#ffd21a";


        return;

      }


      const teacherSessionToken =
        localStorage.getItem(
          "teacherSessionToken"
        );


      if (
        !teacherSessionToken
      ) {

        window.location.href =
          "../index.html";

        return;

      }


      const oldText =
        saveButton.textContent;


      saveButton.disabled =
        true;


      saveButton.textContent =
        "SAVING...";


      assessmentMessage.textContent =
        "กำลังบันทึกผลการประเมิน...";


      assessmentMessage.style.color =
        "#ffd21a";


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "teacher_save_evolve_assessment",
            {

              p_session_token:
                teacherSessionToken,

              p_student_id:
                selectedStudent.student_id,

              p_score_1:
                value1,

              p_score_2:
                value2,

              p_score_3:
                value3,

              p_score_4:
                value4

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
            "ไม่สามารถบันทึกคะแนนได้"
          );

        }


        assessmentMessage.textContent =
          "✓ บันทึกเรียบร้อย "
          +
          result.total_score
          +
          "/16 • ระดับ "
          +
          result.quality_level
          +
          " • "
          +
          (
            result.passed
            ?
            "ผ่าน"
            :
            "ไม่ผ่าน"
          );


        assessmentMessage.style.color =
          "#2cff8c";


        await loadStudents();


        setTimeout(
          function () {

            closeAssessmentModal();

          },
          900
        );


      }

      catch (
        error
      ) {


        console.error(
          "Save Evolve Assessment Error:",
          error
        );


        assessmentMessage.textContent =
          "ไม่สามารถบันทึกผลการประเมินได้: "
          +
          (
            error.message
            ||
            ""
          );


        assessmentMessage.style.color =
          "#ff5ca8";

      }

      finally {


        saveButton.disabled =
          false;


        saveButton.textContent =
          oldText;

      }

    }


    /* =====================================================
       RENDER PAGE
    ===================================================== */

    function renderPage() {


      renderSummary();


      renderTable();

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    classFilter.addEventListener(
      "change",
      renderPage
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


    if (
      closeModalButton
    ) {

      closeModalButton.addEventListener(
        "click",
        closeAssessmentModal
      );

    }


    if (
      cancelButton
    ) {

      cancelButton.addEventListener(
        "click",
        closeAssessmentModal
      );

    }


    if (
      backdrop
    ) {

      backdrop.addEventListener(
        "click",
        closeAssessmentModal
      );

    }


    if (
      saveButton
    ) {

      saveButton.addEventListener(
        "click",
        saveAssessment
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


    /* =====================================================
       START
    ===================================================== */

    setupRubricButtons();


    await loadStudents();


  }
);