$(document).ready(function() {

  var apiRoot = 'https://limitless-coast-14154.herokuapp.com/v1/car/';
  var datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
  var carsContainer = $('[data-cars-container]');

  // init
  getAllCars();

  function createElement(data) {
    var element = $(datatableRowTemplate).clone();

    element.attr('data-car-id', data.id);
    element.find('[data-car-model-section] [data-car-model-paragraph]').text(data.model);
    element.find('[data-car-model-section] [data-car-model-input]').val(data.model);

    element.find('[data-car-year-section] [data-car-year-paragraph]').text(data.year);
    element.find('[data-car-year-section] [data-car-year-input]').val(data.year);

    element.find('[data-car-regNumber-section] [data-car-regNumber-paragraph]').text(data.regNumber);
    element.find('[data-car-regNumber-section] [data-car-regNumber-input]').val(data.regNumber);

    return element;
  }

  function handleDatatableRender(data) {
    carContainer.empty();
    data.forEach(function(car) {
      createElement(car).appendTo(carsContainer);
    });
  }

  function getAllCars() {
    var requestUrl = apiRoot + 'getCars';

    $.ajax({
      url: requestUrl,
      method: 'GET',
      success: handleDatatableRender
    });
  }

  function handleCarUpdateRequest() {
    var parentEl = $(this).parent().parent();
    var carId = parentEl.attr('data-car-id');
    var carModel = parentEl.find('[data-car-model-input]').val();
    var carYear = parentEl.find('[data-car-year-input]').val();
    var carReg = parentEl.find('[data-car-regNumber-input]').val();
    var requestUrl = apiRoot + 'updateCar';

    $.ajax({
      url: requestUrl,
      method: "PUT",
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        id: carId,
        model: carModel,
        year: carYear,
        regNumber: carReg
      }),
      success: function(data) {
        parentEl.attr('data-car-id', data.id).toggleClass('datatable__row--editing');
        parentEl.find('[data-car-model-paragraph]').text(carModel);
        parentEl.find('[data-car-year-paragraph]').text(carYear);
        parentEl.find('[data-car-regNumber-paragraph]').text(carReg);

      }
    });
  }

  function handleCarDeleteRequest() {
    var parentEl = $(this).parent().parent();
    var carId = parentEl.attr('data-car-id');
    var requestUrl = apiRoot + 'deleteCar';

    $.ajax({
      url: requestUrl + '/?' + $.param({
        carId: carId
      }),
      method: 'DELETE',
      success: function() {
        parentEl.slideUp(400, function() { parentEl.remove(); });
      }
    })
  }

  function handleCarSubmitRequest(event) {
    event.preventDefault();

    var carModel = $(this).find('[name="model"]').val();
    var carYear = $(this).find('[name="year"]').val();
    var carReg = $(this).find('[name="regNumber"]').val();

    var requestUrl = apiRoot + 'createCar';

    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        model: carModel,
        year: carYear,
        regNumber: carReg
      }),
      complete: function(data) {
        if(data.status === 200) {
          getAllCars();
        }
      }
    });
  }

  function toggleEditingState() {
    var parentEl = $(this).parent().parent();
    parentEl.toggleClass('datatable__row--editing');

    var carModel = parentEl.find('[data-car-model-paragraph]').text();
    var carYear = parentEl.find('[data-car-year-paragraph]').text();
    var carReg = parentEl.find('[data-car-regNumber-paragraph]').text();


    parentEl.find('[data-car-model-input]').val(carModel);
    parentEl.find('[data-car-year-input]').val(carYear);
    parentEl.find('[data-car-regNumber-input]').val(carReg);
  }

  $('[data-car-add-form]').on('submit', handleCarSubmitRequest);

  carsContainer.on('click','[data-car-edit-button]', toggleEditingState);
  carsContainer.on('click','[data-car-edit-abort-button]', toggleEditingState);
  carsContainer.on('click','[data-car-submit-update-button]', handleCarUpdateRequest);
  carsContainer.on('click','[data-car-delete-button]', handleCarDeleteRequest);
});