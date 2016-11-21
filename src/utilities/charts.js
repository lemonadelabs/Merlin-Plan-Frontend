import { times } from 'lodash';
import { yearsBetween, dateMonthToString } from 'utilities/timeline-utilities'

/** Given a start date and an end date it will return a series of strings in an array*/
export function generateTimeseriesLabels(startDate,endDate, mode="Months"){
  let labels = []
  times(yearsBetween(startDate, endDate, mode) + 1, yearOffset => {
    let year = startDate.getFullYear() + yearOffset
    times(12, monthOffset =>{
      labels.push(`${dateMonthToString(monthOffset)} - ${year}`)
    })
  })
  return labels;
}