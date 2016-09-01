function calculateTimelineYearWidthNoPadding(stageWidth, numberOfYears){
  return stageWidth/numberOfYears
}

function findTimelineMode(yearWidth){
  let mode
  if(yearWidth < 400){
    mode = "Quarters"
  }
  else{
    mode = "Months"
  }
  return mode
}

function calculateTimelinePadding(yearWidth, mode, numberOfYears){
  let divider = mode === "Quarters" ? 40 : 100
  return yearWidth / divider
}

function calculateIndicatorWidth(numberOfIndicators, padding, yearWidth){
  return (yearWidth + padding) / numberOfIndicators - padding
}

function calculateYearWidthModePadding(stageWidth, numberOfYears){
  let yearWidthNoPadding = calculateTimelineYearWidthNoPadding(stageWidth, numberOfYears);
  let mode = findTimelineMode(yearWidthNoPadding)
  let padding = calculateTimelinePadding(yearWidthNoPadding, mode, numberOfYears)
  let totalPadding = padding * (numberOfYears-1)
  let yearWidth = yearWidthNoPadding - (totalPadding / numberOfYears)
  return ({yearWidth, mode, padding})
}
function yearsBetween(start, end){
  let startYear = start.getFullYear()
  let endYear = end.getFullYear()
  return(endYear - startYear)
}
function dateToQuarter(date){
  let month = date.getMonth() + 1
  let quarterPreCeil = month / 3
  let quarter = Math.ceil(quarterPreCeil)
  return (quarter);
}

function indicatorWidthFromMode(mode,padding,yearWidth){
  let indicatorWidth;
  switch (mode) {
    case "Months":
      indicatorWidth = calculateIndicatorWidth(12, padding, yearWidth)
      break;
    case "Quarters":
      indicatorWidth = calculateIndicatorWidth(4, padding, yearWidth)
      break;
    default:
      console.error(`Incorrect mode: ${mode} not defined`)
  }
  return indicatorWidth
}

export {calculateYearWidthModePadding,
        calculateTimelineYearWidthNoPadding,
        findTimelineMode,
        calculateTimelinePadding,
        yearsBetween,
        dateToQuarter,
        calculateIndicatorWidth,
        indicatorWidthFromMode}
