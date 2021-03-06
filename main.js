let elements= []
let elementsUI= []
let sortedArray= []

let amount = 50
let heigtMultiplier = 1
let delay = 1
let sortedIndex = null
let stopSorting = false
let buttonsDisabled = false

const Colour = {
  red: '#EE5E5E',
  darkRed: '#D90000',
  grey: '#9D9D9D',
  black: '#000000',
  white: '#FFFFFF',
  green: '#5ACD6A',
  blue: '#4b92fd'
}

//#region Initializing
initialize()

function initialize(){
  populateElements()
  createUI()  
  randomise(elements)
  updateUI(elements)
  bindings()
  sliderChange()
  
  //Create Sorted array Ref
  sortedArray = elements.slice()
  sortedArray.sort((a, b) => a - b)
}

function disableButtons(value){
  buttonsDisabled = value
  let btnNodes = document.querySelectorAll('.button')

  if(value){
    for (let i = 0; i < btnNodes.length; i++) {
      btnNodes[i].classList.add("disabled")
      document.getElementById('arrLength').disabled = true
    }
  }else{
    for (let i = 0; i < btnNodes.length; i++) {
      btnNodes[i].classList.remove("disabled")
      document.getElementById('arrLength').disabled = false
    }
  }
}

function bindings(){
  $('#sort').bind("click", function(){
    if(buttonsDisabled)
      return
    stopSorting = false
    disableButtons(true)
    bubbleSortVisual(elements, 0, 1, false)
  })

  $('#rand').bind("click", function(){
    if(buttonsDisabled)
      return
    stopSorting = false
    randomise(elements)
  })

  $('#insert').bind("click", function(){
    if(buttonsDisabled)
      return
    stopSorting = false
    disableButtons(true)
    insertionSortVisual(elements, 1, 0, undefined)
  })

  $('#select').bind("click", function(){
    if(buttonsDisabled)
      return
    stopSorting = false
    disableButtons(true)
    selectionSortVisual(elements, 0, 0)
  })

  $('#stop').bind("click", function(){
    stopSorting = true
    disableButtons(false)
  })
}

function populateElements(){
  elements = []
  elementsUI = []
  for(let i = 0; i < amount; i++){
    elements.push(Math.round(.8 * (i+1) * 100) / 100)
  }
}

function createUI(){
  let str = ""
  for(let i = 0; i < amount; i++){
    str += '<div class="element"></div>'
  }
  $('#parent').html(str)
  elementsUI = $('#parent').children()

  updateUI(elements)
}

function updateUI(array){
  for(let i = 0; i < elementsUI.length; i++){
    elementsUI[i].style.height = array[i] + "vh"
  }
}

function sliderChange(){
  delay = document.getElementById('myRange').value
}

function arrayLengthChange(){
  amount = document.getElementById('arrLength').value
  heigtMultiplier = amount/40
  $('#parent').html("")
  populateElements()
  createUI()  
  randomise(elements)
}

function highlightElements(elements, colour){
  for(let i = 0; i < elements.length; i++){
    elements[i].style.backgroundColor = colour
  }
}

function colourSortedElements(array){
  //Check if any elements are in their final location and colour them green
  //Sort array
  array.sort((a, b) => a - b)
  console.log(array)
  //compaire to old array
}

function getElementHeightInNum(el){
  return parseFloat(el.style.height.substring(0, el.style.height.length -2))
}

function checkSortedElements(){
  //Check how many sorted elements
  for(let i=elements.length-1; i > 0; i--){
    console.log(`${getElementHeightInNum(elementsUI[i])} == ${sortedArray[i]}`)
    if(getElementHeightInNum(elementsUI[i]) == sortedArray[i]){
      sortedIndex = i
      console.log(sortedIndex)
    }else{
      break
    }
  }
}


//#endregion

//#region Randomise
function randomise(array) {
  let currentIndex = array.length, temporaryValue, randomIndex
  
  // While there remain elements to shuffle.
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  //Reset Array
  updateUI(array)
  highlightElements(elementsUI, Colour.white)
  sortedIndex = null
  return array
}
//#endregion

//#region Bubble Sort
function bubbleSortVisual(array, index, round, madeAdjustment){
  if(stopSorting)
    return
  if (index != 0){
    highlightElements([elementsUI[index-1], elementsUI[index]], Colour.white)
  }
  
  //Check if index is 1 less than array length {OR IF INDEX IS LABELED AS FULLY SORTED AND NO UNSORTED ELEMENTS AR EBEINH IT}
  if (index >= array.length-1 || index === sortedIndex){
    //[if] no adjustment was made then its fully sorted [else] reset for the next round of sorting 
    if (madeAdjustment == false){
      highlightElements(elementsUI, Colour.green)
      disableButtons(false)
      return
    }else{
      round++
      index = 0
      madeAdjustment = false
      checkSortedElements()
    }
  }

  highlightElements([elementsUI[index]], Colour.darkRed)
  highlightElements([elementsUI[index+1]], Colour.red)
  updateUI(array)

  setTimeout(sort, delay, array, index, round, madeAdjustment)
}

function sort(array, index, round, madeAdjustment){
  if (array[index] > array[index+1]){
    updateUI(array)
    setTimeout(bubbleSwap, delay, array, index) 
  }else{
    setTimeout(bubbleSortVisual, delay, array, index+1, round, madeAdjustment)
  }
}

function bubbleSwap(array, index, round, madeAdjustment){
  let temp = array[index]
  array[index] = array[index+1]
  array[index+1] = temp
  madeAdjustment = true

  updateUI(array)

  highlightElements([elementsUI[index]], Colour.red)
  highlightElements([elementsUI[index+1]], Colour.darkRed)

  setTimeout(bubbleSortVisual, delay, array, index+1, round, madeAdjustment)
}
//#endregion

//#region Insertion Sort
function insertionSortVisual(array, currentIndex, indexToCheck, swapLocation){
  if(stopSorting)
    return
  if(currentIndex > array.length-1){
    highlightElements(elementsUI, Colour.green)
    disableButtons(false)
    return
  }
  //Remove highlight from older checks
  highlightElements(elementsUI, Colour.white) 
  //HighLight Current Checks
  highlightElements([elementsUI[currentIndex]], Colour.blue) 
  highlightElements([elementsUI[indexToCheck]], Colour.red) 

  if(array[currentIndex] < array[indexToCheck]){  
    swapLocation = indexToCheck
  }
  if(indexToCheck === 0 || array[indexToCheck] < array[swapLocation]){
    //Reset 
    setTimeout(insertionSortSwap, delay, array, currentIndex, array[currentIndex], swapLocation)
  }else{
    //Continue
    setTimeout(insertionSortVisual, delay, array, currentIndex, indexToCheck-1, swapLocation)
  }
}

function insertionSortSwap(array, currentIndex, currentValue, swapLocation) {
  if(swapLocation != undefined){
    array.splice(currentIndex, 1)
    array.splice(swapLocation, 0, currentValue)
    highlightElements(elementsUI, Colour.white) 
    highlightElements([elementsUI[currentIndex]], Colour.red)
    highlightElements([elementsUI[swapLocation]], Colour.blue)
  }
  updateUI(array)
  setTimeout(insertionSortVisual, delay, array, currentIndex+1, currentIndex, undefined)
}

//#endregion

//#region Selection Sort

function selectionSortVisual(array, startingIndex, currentIndex, smallestIndex){
  updateUI(array)
  if(stopSorting)
    return
  //Sorted every element
  if(startingIndex == array.length){
    highlightElements(elementsUI, Colour.green)
    disableButtons(false)
    return
  }
  //Checked every element
  if(currentIndex >= array.length){
    setTimeout(selectionSwap, delay, array, startingIndex, smallestIndex)
    return
  }
  if(smallestIndex === undefined){
    smallestIndex = currentIndex
  }

  highlightElements(elementsUI, Colour.white)
  if(getElementHeightInNum(elementsUI[currentIndex]) < getElementHeightInNum(elementsUI[smallestIndex])){
    smallestIndex = currentIndex
  }

  highlightElements([elementsUI[currentIndex]], Colour.darkRed)
  setTimeout(selectionSortVisual, delay, array, startingIndex, currentIndex+1, smallestIndex)
}

function selectionSwap(array, startingIndex, smallestIndex){
  highlightElements(elementsUI, Colour.white)
  highlightElements([elementsUI[startingIndex], elementsUI[smallestIndex]], Colour.darkRed)
  
  let value = array[smallestIndex]
  array.splice(smallestIndex, 1)
  array.splice(startingIndex, 0, value)

  setTimeout(selectionSortVisual, delay, array, startingIndex+1, startingIndex+1)
}

//#endregion