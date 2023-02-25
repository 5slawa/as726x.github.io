// Получение ссылок на элементы UI
let terminalContainer = document.getElementById('terminal');
let inContainer = document.getElementById('terminal').getElementsByClassName('in');
let outContainer = document.getElementById('terminal').getElementsByClassName('out');
let grayContainer = document.getElementById('terminal').getElementsByClassName('gray');
let disconnectButton = document.getElementById('disconnect');
let connectButton = document.getElementById('connect');
let testButton = document.getElementById('test');
let cnt = document.getElementById('container');
let ctx = document.getElementById('myChart').getContext('2d');

myChart = new Chart(ctx,0);
// Отключение от устройства при нажатии на кнопку Disconnect
disconnectButton.addEventListener('click', function() {disconnect();});

connectButton.addEventListener('click', function() {connect();});

testButton.addEventListener('click', function() {test();});

log('','in');
log('', 'out');
for (let i = 0; i < 10; i += 1) {
log('', 'gray')}
function logdelin() {
	inContainer[0].innerHTML='';
	outContainer[0].innerHTML=''; 
}
function logdelg() {
	myChart.destroy()
	for (let i = 0; i < 10; i += 1) {
	grayContainer[i].innerHTML='';}
	logdelin()
}
// Вывод в терминал
function log(data, type = '') {
  terminalContainer.insertAdjacentHTML('afterbegin',
      '<div' + (type ? ' class="' + type + '"' : '') + '>' + data + '</div>');
}

// Отключиться от подключенного устройства
async function disconnect() {
	logdelg()
	try {
    log('Отключение от устройства Bluetooth "' + device.name + '" ', 'gray');   

    if (device.gatt.connected) {
    await  device.gatt.disconnect();
      log('Устройство Bluetooth "' + device.name + '" отключено', 'gray');
    }
    else {
      log('Устройство Bluetooth "' + device.name +
          '" уже отключено', 'gray');
    }
	val = 0
    } catch(error) {
    log('Argh! ' + error , 'gray');
  }
}



async function connect() {  	
  logdelg()
  serviceUuid = 'f0001130-0451-4000-b000-000000000000'
  characteristicUuid = 'f0001131-0451-4000-b000-000000000000'
  log('Запрашивается устройство Bluetooth...', 'gray');
  try {
     device = await navigator.bluetooth.requestDevice({
     filters: [{services: ['f0001130-0451-4000-b000-000000000000']},
	 {name: 'ProjectZero'}]});
	 
	log('Подключение к серверу GATT...', 'gray');
    const server = await device.gatt.connect();

    log('Получение сервиса...', 'gray');
    const service = await server.getPrimaryService(serviceUuid);

    log('Получение характеристики...', 'gray');
    characteristic = await service.getCharacteristic(characteristicUuid);
	log('Устройство готово к тесту...', 'out');
  } catch(error) {
    log('Argh! ' + error , 'gray');
  }
}

async function test() {
  try { 
    logdelin();
	const value = await characteristic.readValue();
    log('Считывание значения...', 'out');
	val = [];
    for (let i = 47; i >= 0; i -= 4) {
	  val.unshift((parseInt((value.getUint8(i).toString(16) + value.getUint8(i-1).toString(16) + value.getUint8(i-2).toString(16) + value.getUint8(i-3).toString(16)),16))/10)
	}	
	log('> ' + val[0] + ' '+ val[1] + ' '+ val[2] + ' ' +val[3] + ' ' +val[4] + ' ' +val[5] + ' ' +val[6] + ' '+ val[7] + ' '+ val[8] + ' ' +val[9] + ' ' +val[10] + ' ' +val[11] + ' ' , 'in');
  } catch(error) {
    log('Argh! ' + error , 'gray');
  }

 myChart.destroy()
	// Vertical bar chart
 myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['V 450', 'B 500', 'G 550', 'Y 570', 'O 600', 'R 610','R 650', 'S 680', 'T 730', 'U 760', 'V 810', 'W 860'],
        datasets: [{
            label: 'TEST',
            data: val,
            backgroundColor: [
                'rgba(255, 0, 255, 0.6)',
                'rgba(0, 0, 255, 0.6)',
                'rgba(0, 255, 0, 0.6)',
                'rgba(255, 255, 0, 0.6)',
                'rgba(255, 125, 0, 0.6)',
				'rgba(255, 0, 0, 0.6)',
                'rgba(255, 145, 145, 0.6)',
				'rgba(145, 145, 145, 0.6)',
                'rgba(133, 152, 0, 0.6)',
                'rgba(117, 189, 189, 0.6)',
                'rgba(80, 140, 80, 0.6)',
                'rgba(230, 135, 175, 0.6)'
            ],
            borderColor: [
                'rgba(255, 0, 255, 1)',
                'rgba(0, 0, 255, 1)',
                'rgba(0, 255, 0, 1)',
                'rgba(255, 255, 0, 1)',
                'rgba(255, 125, 0, 1)',
				'rgba(255, 0, 0, 1)',
                'rgba(255, 145, 145, 1)',
				'rgba(145, 145, 145, 1)',
                'rgba(133, 152, 0, 1)',
                'rgba(117, 189, 189, 1)',
                'rgba(80, 140, 80, 1)',
                'rgba(230, 135, 175, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
		
		responsive: true,
        legend: {
            display: false
        },
		plugins: {
        title: {
            display: false,
            text: 'BHL',
            position: 'top',
            fontSize: 16
         }
		},
        scales: {
			y: {
				display: true,
				type: 'logarithmic',	
                }
				
        }
    }
});	
}




