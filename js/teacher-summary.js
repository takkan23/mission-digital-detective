/* =========================================================
   MISSION DIGITAL DETECTIVE
   TEACHER • SUMMARY
========================================================= */

console.log(
  "### TEACHER SUMMARY V3 LOADED ###"
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
       CONSTANTS
    ===================================================== */

    const TOTAL_SCORE =
      36;


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
        "summaryClassFilter"
      );


    const statusFilter =
      document.getElementById(
        "summaryStatusFilter"
      );


    const searchInput =
      document.getElementById(
        "summaryStudentSearch"
      );


    const refreshButton =
      document.getElementById(
        "summaryRefreshButton"
      );


    const exportButton =
      document.getElementById(
        "summaryExportButton"
      );


    const tableBody =
      document.getElementById(
        "summaryStudentTableBody"
      );


    const studentCount =
      document.getElementById(
        "summaryStudentCount"
      );


    const totalStudents =
      document.getElementById(
        "summaryTotalStudents"
      );


    const completedStudents =
      document.getElementById(
        "summaryCompletedStudents"
      );


    const passedStudents =
      document.getElementById(
        "summaryPassedStudents"
      );


    const failedStudents =
      document.getElementById(
        "summaryFailedStudents"
      );


    const averagePercent =
      document.getElementById(
        "summaryAveragePercent"
      );


    const progressCount =
      document.getElementById(
        "summaryProgressCount"
      );


    const progressBar =
      document.getElementById(
        "summaryMainProgressBar"
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
    ) {

      console.error(
        "Teacher Summary: ไม่พบ Element ที่จำเป็น"
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
              colspan="12"
              class="teacher-table-message"
            >
              กำลังโหลดข้อมูล Summary...
            </td>

          </tr>
        `;


      try {


        const {
          data,
          error
        } =
          await supabaseClient.rpc(
            "get_teacher_summary_students"
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
           SORT
        =============================================== */

        students.sort(
          function (
            a,
            b
          ) {


            const roomCompare =
              getRoomNumber(
                a.class_name
              )
              -
              getRoomNumber(
                b.class_name
              );


            if (
              roomCompare !==
              0
            ) {

              return roomCompare;

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


        updateExportButton();


        renderPage();


        console.log(
          "Summary students:",
          students.length
        );


      }

      catch (
        error
      ) {


        console.error(
          "Teacher Summary Error:",
          error
        );


        tableBody.innerHTML =
          `
            <tr>

              <td
                colspan="12"
                class="teacher-table-message"
                style="
                  color:#ff5ca8 !important;
                "
              >
                ไม่สามารถโหลดข้อมูล Summary ได้
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
        function (
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
       QUALITY RESULT
    ===================================================== */

    function getQualityResult(
      percent
    ) {


      if (
        percent >=
        85
      ) {

        return {

          level: 4,

          quality:
            "ดีเยี่ยม",

          passed:
            true

        };

      }


      if (
        percent >=
        70
      ) {

        return {

          level: 3,

          quality:
            "ดี",

          passed:
            true

        };

      }


      if (
        percent >=
        55
      ) {

        return {

          level: 2,

          quality:
            "พอใช้",

          passed:
            false

        };

      }


      return {

        level: 1,

        quality:
          "ควรปรับปรุง",

        passed:
          false

      };

    }


    /* =====================================================
       CALCULATE STUDENT
    ===================================================== */

    function calculateStudentResult(
      student
    ) {


      const discoverCompleted =
        student.discover_completed ===
        true;


      const analyzeCompleted =
        student.analyze_completed ===
        true;


      const reasonCompleted =
        student.reason_completed ===
        true;


      const evolveCompleted =
        student.evolve_completed ===
        true;


      const dareCompleted =
        discoverCompleted
        &&
        analyzeCompleted
        &&
        reasonCompleted
        &&
        evolveCompleted;


      const analyzeScore =
        Number(
          student.analyze_score
          ??
          0
        );


      const reasonScore =
        Number(
          student.reason_score
          ??
          0
        );


      const evolveScore =
        Number(
          student.evolve_score
          ??
          0
        );


      const totalScore =
        analyzeScore
        +
        reasonScore
        +
        evolveScore;


      const percent =
        (
          totalScore
          /
          TOTAL_SCORE
        )
        *
        100;


      const qualityResult =
        getQualityResult(
          percent
        );


      return {

        discoverCompleted,

        analyzeCompleted,

        reasonCompleted,

        evolveCompleted,

        dareCompleted,

        analyzeScore,

        reasonScore,

        evolveScore,

        totalScore,

        percent,

        level:
          qualityResult.level,

        quality:
          qualityResult.quality,

        passed:
          dareCompleted
          &&
          qualityResult.passed

      };

    }


    /* =====================================================
       CLASS STUDENTS
    ===================================================== */

    function getClassStudents() {


      const selectedClass =
        classFilter.value;


      if (
        !selectedClass
      ) {

        return students;

      }


      return students.filter(
        function (
          student
        ) {

          return (
            student.class_name ===
            selectedClass
          );

        }
      );

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


          const result =
            calculateStudentResult(
              student
            );


          /* =============================================
             STATUS
          ============================================= */

          if (
            status ===
            "passed"
            &&
            !result.passed
          ) {

            return false;

          }


          if (
            status ===
            "failed"
            &&
            (
              !result.dareCompleted
              ||
              result.passed
            )
          ) {

            return false;

          }


          if (
            status ===
            "incomplete"
            &&
            result.dareCompleted
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
       SUMMARY
    ===================================================== */

    function renderSummary() {


      const current =
        getClassStudents();


      const total =
        current.length;


      const completedResults =
        current
          .map(
            function (
              student
            ) {

              return calculateStudentResult(
                student
              );

            }
          )
          .filter(
            function (
              result
            ) {

              return (
                result.dareCompleted ===
                true
              );

            }
          );


      const completed =
        completedResults.length;


      const passed =
        completedResults.filter(
          function (
            result
          ) {

            return (
              result.passed ===
              true
            );

          }
        )
        .length;


      const failed =
        completed
        -
        passed;

/* =====================================================
   CLASS AVERAGE PERCENT

   ผลรวมร้อยละของนักเรียนที่ทำครบ
   หารด้วยจำนวนนักเรียนทั้งหมดในห้อง

   นักเรียนที่ยังทำไม่ครบ = 0%
===================================================== */

const percentSum =
  completedResults.reduce(
    function (
      sum,
      result
    ) {

      return (
        sum
        +
        result.percent
      );

    },
    0
  );


const average =
  total === 0
  ?
  0
  :
  percentSum
  /
  total;

      /* ===============================================
         CARDS
      =============================================== */

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


      /* ===============================================
         AVERAGE PERCENT
         แสดงเมื่อเลือกห้องเท่านั้น
      =============================================== */

      if (
        averagePercent
      ) {

        if (
          classFilter.value
        ) {

          if (
            completed ===
            0
          ) {

            averagePercent.textContent =
              "0.00%";

          }

          else {

            averagePercent.textContent =
              average.toFixed(
                2
              )
              +
              "%";

          }

        }

        else {

          averagePercent.textContent =
            "-";

        }

      }


      /* ===============================================
         PROGRESS
      =============================================== */

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


      const completionPercent =
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
        progressBar
      ) {

        progressBar.style.width =
          completionPercent
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
        averagePercent
      ) {

        averagePercent.textContent =
          "-";

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
                colspan="12"
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


          const result =
            calculateStudentResult(
              student
            );


          const row =
            document.createElement(
              "tr"
            );


          /* =============================================
             D
          ============================================= */

          const discoverHTML =
            result.discoverCompleted
            ?
            `
              <span class="teacher-green">
                ✓
              </span>
            `
            :
            `
              <span class="teacher-yellow">
                -
              </span>
            `;


          /* =============================================
             SCORE
          ============================================= */

          const analyzeHTML =
            result.analyzeCompleted
            ?
            `${result.analyzeScore}`
            :
            "-";


          const reasonHTML =
            result.reasonCompleted
            ?
            `${result.reasonScore}`
            :
            "-";


          const evolveHTML =
            result.evolveCompleted
            ?
            `${result.evolveScore}`
            :
            "-";


          const totalHTML =
            result.dareCompleted
            ?
            `
              <strong>
                ${result.totalScore} /36
              </strong>
            `
            :
            "-";


          /* =============================================
             PERCENT
          ============================================= */

          const percentHTML =
            result.dareCompleted
            ?
            result.percent.toFixed(
              2
            )
            +
            "%"
            :
            "-";


          /* =============================================
             QUALITY
          ============================================= */

          const qualityHTML =
            result.dareCompleted
            ?
            `
              <span>
                ${result.level}
                •
                ${escapeHTML(
                  result.quality
                )}
              </span>
            `
            :
            "-";


          /* =============================================
             FINAL RESULT
          ============================================= */

          let finalHTML;


          if (
            !result.dareCompleted
          ) {

            finalHTML =
              `
                <span class="teacher-yellow">
                  ยังไม่ครบ DARE
                </span>
              `;

          }

          else if (
            result.passed
          ) {

            finalHTML =
              `
                <span
                  class="
                    teacher-discover-status
                    completed
                  "
                >
                  ✓ ผ่าน
                </span>
              `;

          }

          else {

            finalHTML =
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
                ${discoverHTML}
              </td>


              <td>
                ${analyzeHTML}
              </td>


              <td>
                ${reasonHTML}
              </td>


              <td>
                ${evolveHTML}
              </td>


              <td>
                ${totalHTML}
              </td>


              <td>
                ${percentHTML}
              </td>


              <td>
                ${qualityHTML}
              </td>


              <td>
                ${finalHTML}
              </td>

            `;


          tableBody.appendChild(
            row
          );

        }
      );

    }


    /* =====================================================
       EXPORT BUTTON
    ===================================================== */

    function updateExportButton() {


      if (
        !exportButton
      ) {

        return;

      }


      exportButton.disabled =
        !classFilter.value;

    }


    /* =====================================================
       EXPORT EXCEL
    ===================================================== */

    function exportSummaryExcel() {


      const selectedClass =
        classFilter.value;


      /* ===============================================
         MUST SELECT CLASS
      =============================================== */

      if (
        !selectedClass
      ) {

        alert(
          "กรุณาเลือกห้องเรียนก่อน Export Excel"
        );

        return;

      }


      if (
        typeof XLSX ===
        "undefined"
      ) {

        alert(
          "ไม่สามารถโหลดระบบ Excel ได้"
        );

        return;

      }


      const classStudents =
        getClassStudents();


      if (
        classStudents.length ===
        0
      ) {

        alert(
          "ไม่พบข้อมูลนักเรียนในห้องนี้"
        );

        return;

      }


      /* ===============================================
         STUDENT DATA
      =============================================== */

      const excelStudents =
        classStudents.map(
          function (
            student
          ) {


            const result =
              calculateStudentResult(
                student
              );


            let finalResult =
              "ยังไม่ครบ DARE";


            if (
              result.dareCompleted
            ) {

              finalResult =
                result.passed
                ?
                "ผ่าน"
                :
                "ไม่ผ่าน";

            }


            return {

              "เลขที่":
                student.student_number
                ??
                "",

              "รหัสนักเรียน":
                student.student_id
                ||
                "",

              "ชื่อ - นามสกุล":
                student.student_name
                ||
                "",

              "ห้อง":
                student.class_name
                ||
                "",

              "D • Discover":
                result.discoverCompleted
                ?
                "Completed"
                :
                "Pending",

              "A • Analyze /10":
                result.analyzeCompleted
                ?
                result.analyzeScore
                :
                "",

              "R • Reason /10":
                result.reasonCompleted
                ?
                result.reasonScore
                :
                "",

              "E • Evolve /16":
                result.evolveCompleted
                ?
                result.evolveScore
                :
                "",

              "คะแนนรวม /36":
                result.dareCompleted
                ?
                result.totalScore
                :
                "",

              "ร้อยละ":
                result.dareCompleted
                ?
                Number(
                  result.percent.toFixed(
                    2
                  )
                )
                :
                "",

              "ระดับคุณภาพ":
                result.dareCompleted
                ?
                (
                  "ระดับ "
                  +
                  result.level
                  +
                  " "
                  +
                  result.quality
                )
                :
                "",

              "ผลการประเมิน":
                finalResult

            };

          }
        );


      /* ===============================================
         CLASS SUMMARY
      =============================================== */

      const completedResults =
        classStudents
          .map(
            calculateStudentResult
          )
          .filter(
            function (
              result
            ) {

              return (
                result.dareCompleted ===
                true
              );

            }
          );


      const completed =
        completedResults.length;


      const passed =
        completedResults.filter(
          function (
            result
          ) {

            return (
              result.passed ===
              true
            );

          }
        )
        .length;


      const failed =
        completed
        -
        passed;
const percentSum =
  completedResults.reduce(
    function (
      sum,
      result
    ) {

      return (
        sum
        +
        result.percent
      );

    },
    0
  );


const average =
  classStudents.length ===
  0
  ?
  0
  :
  percentSum
  /
  classStudents.length;

      /* ===============================================
         QUALITY OF CLASS
      =============================================== */

      const classQuality =
        getQualityResult(
          average
        );


      /* ===============================================
         WORKBOOK
      =============================================== */

      const workbook =
        XLSX.utils.book_new();


      /* ===============================================
         SHEET 1 : SUMMARY
      =============================================== */

      const summaryData =
        [

          [
            "MISSION DIGITAL DETECTIVE"
          ],

          [
            "สรุปผล DARE Learning Model"
          ],

          [],

          [
            "ห้องเรียน",
            selectedClass
          ],

          [
            "นักเรียนทั้งหมด",
            classStudents.length
          ],

          [
            "DARE COMPLETE",
            completed
          ],

          [
            "ผ่าน",
            passed
          ],

          [
            "ไม่ผ่าน",
            failed
          ],

          [
            "ร้อยละเฉลี่ยของห้อง",
            Number(
              average.toFixed(
                2
              )
            )
          ],

          [
            "ระดับคุณภาพของห้อง",
            completed > 0
            ?
            (
              "ระดับ "
              +
              classQuality.level
              +
              " "
              +
              classQuality.quality
            )
            :
            "-"
          ],

          [],

          [
            "เกณฑ์การตัดสินคุณภาพ"
          ],

          [
            "ร้อยละ",
            "ระดับคุณภาพ",
            "ความหมาย",
            "ผลการประเมิน"
          ],

          [
            "85–100",
            4,
            "ดีเยี่ยม",
            "ผ่าน"
          ],

          [
            "70–84",
            3,
            "ดี",
            "ผ่าน"
          ],

          [
            "55–69",
            2,
            "พอใช้",
            "ไม่ผ่าน"
          ],

          [
            "ต่ำกว่า 55",
            1,
            "ควรปรับปรุง",
            "ไม่ผ่าน"
          ]

        ];


      const summarySheet =
        XLSX.utils.aoa_to_sheet(
          summaryData
        );


      summarySheet["!cols"] =
        [

          {
            wch: 28
          },

          {
            wch: 24
          },

          {
            wch: 22
          },

          {
            wch: 20
          }

        ];


      XLSX.utils.book_append_sheet(
        workbook,
        summarySheet,
        "สรุปห้อง"
      );


      /* ===============================================
         SHEET 2 : STUDENTS
      =============================================== */

      const studentSheet =
        XLSX.utils.json_to_sheet(
          excelStudents
        );


      studentSheet["!cols"] =
        [

          {
            wch: 8
          },

          {
            wch: 14
          },

          {
            wch: 32
          },

          {
            wch: 12
          },

          {
            wch: 18
          },

          {
            wch: 18
          },

          {
            wch: 18
          },

          {
            wch: 18
          },

          {
            wch: 18
          },

          {
            wch: 14
          },

          {
            wch: 22
          },

          {
            wch: 18
          }

        ];


      XLSX.utils.book_append_sheet(
        workbook,
        studentSheet,
        "รายชื่อนักเรียน"
      );


      /* ===============================================
         FILE NAME
      =============================================== */

      const safeClassName =
        selectedClass
          .replaceAll(
            "/",
            "-"
          )
          .replaceAll(
            " ",
            ""
          );


      const fileName =
        "DARE_Summary_"
        +
        safeClassName
        +
        ".xlsx";


      /* ===============================================
         DOWNLOAD
      =============================================== */

      XLSX.writeFile(
        workbook,
        fileName
      );

    }


    /* =====================================================
       PAGE
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
      function () {


        updateExportButton();


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


    if (
      exportButton
    ) {

      exportButton.addEventListener(
        "click",
        exportSummaryExcel
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

    await loadStudents();


  }
);