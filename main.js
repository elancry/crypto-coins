(function () {
  // GLOBAL VARIBELS
  let coinsArray = [];
  let selectedCoinArr = [];
  let coinsMap = new Map();
  let toggleIndex;
  let IntervalId;
  let updateSelected;

  $(function () {
    // Sidebar toggle behavior
    $("#sidebarCollapse").on("click", function () {
      $("#sidebar, #content").toggleClass("active");
    });

    // AJAX REQUEST || PAGE LOADING.
    loadingHomePage();
    function loadingHomePage() {
      $(function () {
        $("#page-loader-animation").show();
        $.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=ils")
          .then(function (response) {
            $("#page-loader-animation").hide();
            coinsArray = response;
            onLoadPage();
            searchByFirstLetter();
            clearTogglesUI();
            clearSearchUI();
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }

    // Loading all page functions when you load / refresh page.
    function onLoadPage() {
      for (let i = 0; i < coinsArray.length; i++) {
        apppendCard(coinsArray[i]);
        onMoreinfoClicked(coinsArray[i].id);
        checkBox(coinsArray[i]);
      }
    }

    // Clear all selected toggles button
    function clearTogglesUI() {
      $(".clear-selected-modal").click(() => {
        $(`input`).prop("checked", false);
        coinsArray = [];
        selectedCoinArr = [];
        $("#selectedCoins").html("");
        localStorage.clear();
        $("#modal-body").empty();
        $("#myModal").hide();
      });
    }

    // Clear search input
    function clearSearchUI() {
      $("#clear-search").click(() => {
        $("#search-input").val("");
        $(".col-sm-4").show();
      });
    }

    // SOCIAL SECTION
    function facebook() {
      $("#facebook").click(() => {
        window.open("https://www.facebook.com/sahar.elancry", "_blank");
      });
    }
    facebook();

    function instagram() {
      $("#instagram").click(() => {
        window.open("https://www.instagram.com/sahar_elancry/"), "_blank";
      });
    }
    instagram();

    function linkedIn() {
      $("#linked-in").click(() => {
        window.open("https://www.linkedin.com/in/sahar-elancry-862a52214/"), "_blank";
      });
    }
    linkedIn();

    function github() {
      $("#github").click(() => {
        window.open("https://github.com/elancry/elancry"), "_blank";
      });
    }
    github();

    //HIDE & SHOW DIV's ELEMENTS
    $("#home").click(function () {
      clearInterval(IntervalId);
      $("#about-div").hide();
      $("#chartContainer").hide();
      $(".search-div").show();
      $(".col-sm-4").append().fadeIn("slow");
      $("#clear-selected").show();
      $(".selectedCoinUI").show();
    });

    $("#about").click(function () {
      clearInterval(IntervalId);
      $(".col-sm-4").hide();
      $("#chartContainer").hide();
      $("#about-div").hide().append().fadeIn("slow");
      $("#about-div").empty();
      $(".search-div").hide();
      $(".selectedCoinUI").hide();
      $("#clear-selected").hide();
      appandAbout();
    });

    $("#live-report").click(function () {
      clearInterval(IntervalId);
      $(".selectedCoinUI").hide();
      $(".col-sm-4").hide();
      $("#about-div").hide();
      $("#chartContainer").show();
      $("#chartContainer").hide().append().fadeIn("slow");
      $(".search-div").hide();
      $("#clear-selected").hide();
      showLiveReport();
    });

    // Block the user from using any symbols(!/^[A-Z0-9]+$/)
    function blockSymbolsUI() {
      $("#search-input").on("keypress", function (e) {
        var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (!/^[A-Z0-9]+$/i.test(key)) {
          event.preventDefault();
        }
      });
    }

    // Function that letting you to search by first letter you typed on field.
    function searchByFirstLetter() {
      clearInterval(IntervalId);
      $("#search-input").on("keyup", function () {
        let value = $("#search-input").val().toUpperCase();

        $(".col-sm-4").each(function () {
          let card = $(this).attr("id").toUpperCase();
          let symbol = $(this).attr("class").toUpperCase();

          if (card.includes(value) || symbol.includes(value)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });
      blockSymbolsUI();
    }

    // Checkbox toggles function
    function checkBox(card) {
      $(`#${card.symbol}`).on("click", function () {
        toggleIndex = card.symbol.replace("check", "");

        if ($(this).prop("checked") == true) {
          if (selectedCoinArr.length < 5) {
            selectedCoinArr.push(toggleIndex);
            saveSelectedToggles();
            console.log(selectedCoinArr);
          } else {
            $(this).prop("checked", false);
            appendModal();
            $("#myModal").hide().append().fadeIn("slow");
          }
        } else {
          selectedCoinArr.splice(selectedCoinArr.indexOf(toggleIndex), 1);
          saveSelectedToggles();
          console.log(selectedCoinArr);
        }
      });
      loadSelectedToggles();
    }

    // Save the selected toggles
    function saveSelectedToggles() {
      localStorage.setItem("SelectedCoins", JSON.stringify(selectedCoinArr));
      updateSelected = "";
      for (let i = 0; i < selectedCoinArr.length; i++) {
        if (i == selectedCoinArr.length - 1) {
          updateSelected += selectedCoinArr[i].toUpperCase();
        } else {
          updateSelected += selectedCoinArr[i].toUpperCase() + ", ";
        }
      }
      $("#selectedCoins").html(updateSelected);
    }

    function loadSelectedToggles() {
      let selectedCoins = JSON.parse(localStorage.getItem("SelectedCoins"));
      saveSelectedToggles();
      if (!selectedCoins) {
        return;
      }
      for (let i = 0; i < selectedCoins.length; i++) {
        if ($(`#${selectedCoins[i]}`).prop("checked", true)) {
          selectedCoinArr = selectedCoins;
        }
      }
    }

    // Creating the MODAL-BODY.
    function appendModal() {
      for (let i = 0; i < selectedCoinArr.length; i++) {
        $("#modal-body").append(
          `<div class="col-sm-4">
          <div class="card cardModal">
            <div class="card-body">
              <label class="modal-switch">
                <input type="checkbox" class="checkboxes" id="chosenToggle${
                  selectedCoinArr[i]
                }" /> <span class="slider round modalSlider"></span>
              </label>
              <h6 class="card-title-modal">${selectedCoinArr[i].toUpperCase()}</h6>
            </div>
          </div>
        </div> `
        );
      }
      onClickKeepCurrentToggles();
    }

    // Keep the current Toggles and exit from modal without change noting.
    function onClickKeepCurrentToggles() {
      for (let i = 0; i < selectedCoinArr.length; i++) {
        $(`#chosenToggle${selectedCoinArr[i]}`).prop("checked", true);
        $(`#keepcurrent`).on("click", () => {
          $("#modal-body").empty();
          $("#myModal").hide();
        });
      }
      onChangeTogglesCoins();
    }

    // Replacing 1 toggle  with switching to another toggle from the 5 toggles
    // I have already selected on the home page.
    function onChangeTogglesCoins() {
      for (let i = 0; i < selectedCoinArr.length; i++) {
        $(`#chosenToggle${selectedCoinArr[i]}`).on("click", () => {
          console.log(selectedCoinArr[i]);
          $("#myModal").modal("hide");
          $(`#${selectedCoinArr[i]}`).prop("checked", false);
          $(`#${toggleIndex}`).prop("checked", true);
          selectedCoinArr.splice(selectedCoinArr.indexOf(selectedCoinArr[i]), 1);
          $("#myModal").hide();
          saveSelectedToggles();
          selectedCoinArr.push(toggleIndex);
          saveSelectedToggles();
          toggleIndex = "";
          $("#modal-body").empty();
        });
      }
    }

    // Creating card.
    function apppendCard(card) {
      $("#maincontainer").append(
        `<div class="${card.id} col-sm-4" id="${card.symbol.toUpperCase()}">
          <div class="card bg-transparent">
            <div class="card-body">
              <label class="switch">
                <input type="checkbox" class="checkboxes" id="${card.symbol}" />
                <span class="slider round"></span>
              </label>
              <h5 id="${card.symbol.toUpperCase()}" class="card-title">${card.symbol.toUpperCase()}</h5>
              <p class="card-name">${card.name}</p>
              <button
                class="btn moreInfo"
                id="infoBtn${card.id}"
                type="button"
                data-toggle="collapse"
                data-target="#open${card.id}"
                aria-expanded="false"
                aria-controls="collapseExample">
                more info<i class="fas fa-chart-bar"></i>
              </button>
              <div class="collapse" id="open${card.id}">
                <div class="card card-body" id="${card.id}">
                  <div class="d-flex loader justify-content-center">
                    <div class="spinner-border text-light" role="status"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> `
      );
    }
  });

  // Creating the ABOUT SECTION
  function appandAbout() {
    $("#about-div").append(
      `<div class="c-about">
      <div id="wrapper">
        <div id="about-me-div">
        </div>
        <div>
          <h1 class="text-about">About this project</h1>
          <p class="about-font-size text-center"> <b>This is my second project for the John Bryce Full Stack Web Development class.</b></p>
          <p class="text-center">
           <b> Some of the features that can be found in CryptoSelect include : </b> <br/>
            - Coin of interest selection by toggle switch.<br/>
            - Save selected coins toggles on Local Storage.<br/>
            - save more info coin on cache(Map and Set).<br/>
            - every 2mins delete and get new values to more info from API.<br/>
            - Expandable information per coin on the homepage.<br/>
            - Real time CryptoCurrency updates in graph format.<br/>
            - Search Capabilities.<br/>
            - 2 APIs used for information retrieval:<br/>
            + https://api.coingecko.com/ <br/>
            + https://min-api.cryptocompare.com/ <br/></br>
            <b>This projected was created using :</b> HTML5, CSS3, JAVASCRIPT, JQUERY, AJAX, REST API, CANVAS JS & BOOTSTRAP 4.
            <br><br>
            <b class="about-font-size"> To get started, feel free to select up to 5 coins to diplay in the live report. <br />
            If you would like to choose a sixth, you'll have to replace one of your currently selected coins with a new one.</b
            >

    <h1 class="text-about about-font-size">WHO AM I ?</h1>
    <div class="text-center">
    <b>Name : </b>Sahar Elancry <br>
    <b>Age : </b> 29 <br>
    <b>Contact : </b> saharelan92@@gmail.com <br>
    <b>Hobbies : </b>Addicted to the gym and especially to snowboarding on the Alps in France.<br>
    Can be hours on a computer without noticing .. well well thats also one of my favorite things<br>
    And of course to program and design websites on best practice!<br>
    </div>
    <div class="d-flex justify-content-center flex-wrap">
    <img class="image" src="img/pic1.jpg">
    <img class="image" src="img/pic3.jpg">
    <img class="image"src="img/pic4.jpg">
    </div>
        </div>
      </div>
    </div>`
    );
  }

  // SECOND AJAX REQUEST
  function requestFromAjax(coinId) {
    $("#page-loader-animation").hide();
    $.get(`https://api.coingecko.com/api/v3/coins/${coinId}`)
      .then(function (coin) {
        $(".card-loader-animation").show();
        saveMoreInfoInMap(coin, coinId);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function saveMoreInfoInMap(coin, coinId) {
    let img = coin.image.small;
    let ils = coin.market_data.current_price.ils;
    let eur = coin.market_data.current_price.eur;
    let usd = coin.market_data.current_price.usd;
    let coinObj = { img, ils, eur, usd };
    addCoinMoreInfoToUI(coinId, coinObj);
    removeMoreInfo(coinId, coinObj, coin);
  }

  // Add coin more info to UI
  function addCoinMoreInfoToUI(coinId, coin) {
    $(".card-loader-animation").hide();
    $(`#${coinId}`).html(`<div><img src=${coin.img}/></div><br>
         <div>USD : ${coin.usd} <i class="fas fa-dollar-sign dollar"></i></div>
         <div>EUR : ${coin.eur} <i class="fas fa-euro-sign euro"></i></div>
         <div>ILS : ${coin.ils} <i class="fas fa-shekel-sign shekel"></i></div>`);
  }
  // On click more info button saving the more info values in map (cache);
  function onMoreinfoClicked(coinId) {
    $(`#infoBtn${coinId}`).on("click", function () {
      $(".card-loader-animation").show();
      if (coinsMap.has(coinId)) {
        let backUpCoin = coinsMap.get(coinId);
        addCoinMoreInfoToUI(coinId, backUpCoin);
        console.log("Get from cache");
      } else {
        requestFromAjax(coinId);
        console.log("Get from ajax");
      }
    });
  }
  // Remove more info values after 2min from cache, and getting the new values.
  function removeMoreInfo(coinId, coinObj, coin) {
    coinsMap.set(coinId, coinObj);
    setTimeout(() => coinsMap.delete(coin.id), 120000);
  }

  // Live report section
  function showLiveReport() {
    if (selectedCoinArr.length == 0) {
      $("#chartContainer").hide();
      $(".col-sm-4").show();
      $(".search-div").show();
      $("#clear-selected").show();
      $(".selectedCoinUI").show();
      $(".footer").show();
      Swal.fire({
        title: "Pay attention!",
        text: "Live report cannot be empty, you have to mark up to 5 coins order to display live report on the graph.",
        icon: "error",
        confirmButtonText: "Cool",
      });
    } else {
      $(".card-loader-animation").show();

      let selectedCoinOnGraph1 = [];
      let selectedCoinOnGraph2 = [];
      let selectedCoinOnGraph3 = [];
      let selectedCoinOnGraph4 = [];
      let selectedCoinOnGraph5 = [];
      let coinsKeysArr = [];

      IntervalId = setInterval(() => {
        getData();
      }, 2000);

      function getData() {
        let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${selectedCoinArr[0]},${selectedCoinArr[1]},${selectedCoinArr[2]},${selectedCoinArr[3]},${selectedCoinArr[4]}&tsyms=USD`;
        $.get(url).then((coin_value) => {
          $(".card-loader-animation").hide();

          let dateNow = new Date();
          let counter = 1;
          coinsKeysArr = [];

          for (let key in coin_value) {
            if (counter == 1) {
              selectedCoinOnGraph1.push({ x: dateNow, y: coin_value[key].USD });
              coinsKeysArr.push(key);
            }

            if (counter == 2) {
              selectedCoinOnGraph2.push({ x: dateNow, y: coin_value[key].USD });
              coinsKeysArr.push(key);
            }

            if (counter == 3) {
              selectedCoinOnGraph3.push({ x: dateNow, y: coin_value[key].USD });
              coinsKeysArr.push(key);
            }

            if (counter == 4) {
              selectedCoinOnGraph4.push({ x: dateNow, y: coin_value[key].USD });
              coinsKeysArr.push(key);
            }

            if (counter == 5) {
              selectedCoinOnGraph5.push({ x: dateNow, y: coin_value[key].USD });
              coinsKeysArr.push(key);
            }
            counter++;
          }
          createGraph();
          $(".card-loader-animation").hide();
        });
      }

      // Creating graph the graph from libary of canvasJS.
      function createGraph() {
        var chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: false,
          zoomEnabled: true,
          exportEnabled: true,
          backgroundColor: "#00142ae7",
          title: {
            text: "Real-time Price Of CryptoCurrencies in $USD",
            fontFamily: "verdana",
            fontColor: "white",
          },

          axisX: {
            valueFormatString: "HH:mm:ss",
            labelFontColor: "white",
          },
          axisY: {
            title: "Currencies Value",
            suffix: "$",
            titleFontColor: "white",
            lineColor: "white",
            gridColor: "white",
            labelFontColor: "white",
            tickColor: "white",
            includeZero: false,
          },
          toolTip: {
            shared: true,
          },
          legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries,
          },
          data: [
            {
              type: "spline",
              name: coinsKeysArr[0],
              showInLegend: true,
              xValueFormatString: "HH:mm:ss",
              dataPoints: selectedCoinOnGraph1,
            },
            {
              type: "spline",
              name: coinsKeysArr[1],
              showInLegend: true,
              xValueFormatString: "HH:mm:ss",
              dataPoints: selectedCoinOnGraph2,
            },
            {
              type: "spline",
              name: coinsKeysArr[2],
              showInLegend: true,
              xValueFormatString: "HH:mm:ss",
              dataPoints: selectedCoinOnGraph3,
            },
            {
              type: "spline",
              name: coinsKeysArr[3],
              showInLegend: true,
              xValueFormatString: "HH:mm:ss",
              dataPoints: selectedCoinOnGraph4,
            },
            {
              type: "spline",
              name: coinsKeysArr[4],
              showInLegend: true,
              xValueFormatString: "HH:mm:ss",
              dataPoints: selectedCoinOnGraph5,
            },
          ],
        });

        chart.render();

        function toggleDataSeries(e) {
          if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
          } else {
            e.dataSeries.visible = true;
          }
          e.chart.render();
        }
      }
    }
  }

  // Function that letting you onclick button "TOP", you will moving up to the start of the page.
  window.onscroll = function () {
    validationScroller();
  };

  function validationScroller() {
    if (document.body.scrolltop > 20 || document.documentElement.scrollTop > 20) {
      $("#scroll-up-btn").css({ display: "block" });
    } else {
      $("#scroll-up-btn").css({ display: "none" });
    }
  }
})();
function ScrollPageToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
