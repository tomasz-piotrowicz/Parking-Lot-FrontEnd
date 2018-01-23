$(document).ready(function() {

  var apiRoot = 'https://parking-lot-manager-app.herokuapp.com/v1/car/';
  var datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
  var carsContainer = $('[data-cars-container]');

  // init
  getAllCars();

  function createElement(data) {
    var element = $(datatableRowTemplate).clone();

    element.attr('data-car-id', data.id);
    element.find('[data-car-name-section] [data-car-name-paragraph]').text(data.model);
    element.find('[data-car-name-section] [data-car-name-input]').val(data.model);

    element.find('[data-car-content-section] [data-car-content-paragraph]').text(data.regNumber);
    element.find('[data-car-content-section] [data-car-content-input]').val(data.regNumber);

    return element;
  }

  function handleDatatableRender(data) {
    carsContainer.empty();
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
    var carModel = parentEl.find('[data-car-name-input]').val();
    var carReg = parentEl.find('[data-car-content-input]').val();
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
        regNumber: carReg
      }),
      success: function(data) {
        parentEl.attr('data-car-id', data.id).toggleClass('datatable__row--editing');
        parentEl.find('[data-car-name-paragraph]').text(carModel);
        parentEl.find('[data-car-content-paragraph]').text(carReg);
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
    var carReg = $(this).find('[name="content"]').val();

    var requestUrl = apiRoot + 'createCar';

    $.ajax({
      url: requestUrl,
      method: 'POST',
      processData: false,
      contentType: "application/json; charset=utf-8",
      dataType: 'json',
      data: JSON.stringify({
        model: carModel,
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

    var carTitle = parentEl.find('[data-car-name-paragraph]').text();
    var carContent = parentEl.find('[data-car-content-paragraph]').text();

    parentEl.find('[data-car-name-input]').val(carTitle);
    parentEl.find('[data-car-content-input]').val(carContent);
  }

  $('[data-car-add-form]').on('submit', handleCarSubmitRequest);

  carsContainer.on('click','[data-car-edit-button]', toggleEditingState);
  carsContainer.on('click','[data-car-edit-abort-button]', toggleEditingState);
  carsContainer.on('click','[data-car-submit-update-button]', handleCarUpdateRequest);
  carsContainer.on('click','[data-car-delete-button]', handleCarDeleteRequest);
});