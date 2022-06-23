import React, { useEffect, useRef, useState } from 'react'
import 'moment/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Filler,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Line,Doughnut } from 'react-chartjs-2';
import { Checkbox, DatePicker, Radio } from 'antd';
import moment, { Moment } from 'moment-timezone';
import TicketServies from "../../../db/services/ticket.services";
import ITicket from "../../../db/types/ticket.type";
import PackageServies from "../../../db/services/package.services";
import IPackage from "../../../db/types/package.type";

import './style.scss';
ChartJS.register(
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);
const options = {
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      yAlign: "bottom",
      padding: {
        left: 30,
        right: 30,
        top: 5,
        bottom: 5,
      },
      backgroundColor: "#5185F7",
      displayColors: false,
      callbacks: {
        title: function (tooltipItem:any) {
          return;
        },
        label: function (tooltipItem:any) {
          return tooltipItem.dataset.data[tooltipItem["dataIndex"]];
        },
      },
    },
  },
  legend: {
    display: false,
  },
  elements: {
    line: {
      tension: 0.5,
    },
    point:{
      radius: 0
  }
  },
  scales: {
    y: 
      {
        type: "linear",
        position: "bottom",
        ticks: {
          max: 10,
          callback: function(value:any) {
            if(value % 1000 === 0){
              return `${value/1000}k`
            }
            if(value % 1000000 === 0){
              return `${value/1000000}tr`
            }
          }
        },
      },
    
  },
};
const optionsDonut = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    }
  },
  showTooltips: true,
};
type Props = {}

const Dashboard = (props: Props) => {
  const [dateSelected, setDateSelected] = useState(moment())
  const [dateDognutSelected, setDateDognutSelected] = useState(moment())
  const [filter, setFilter] = useState('day')
  const [filterDognut, setFilterDognut] = useState('day')
  const [tickets, setTickets] = useState<ITicket[]>()
  const [packages, setPackages] = useState<IPackage[]>()
  const [donutInfo, setDonutInfo] = useState<any[]>([])
  useEffect(() => {
    (async()=>{
      let data1 = await TicketServies.getTickets()
      setTickets(data1)
      let data2 = await PackageServies.getPackageTickets()
      setPackages(data2)
    })()
  }, [])
  useEffect(()=>{
    if(packages){
      let info = packages.map((item)=>{
        return renderDataDoughnut(dateDognutSelected,item.codePackage)
      })
      setDonutInfo([...info])
    }
  },[dateDognutSelected,filterDognut,packages])
  //Get list days in week
  const getListDaysInWeek = (inputDay : Moment)=>{
      let dayChoose = inputDay.clone()
      var startOfWeek = dayChoose.clone().startOf('isoWeek');
      var endOfWeek = dayChoose.clone().endOf('isoWeek');
      var days = [];
      var day = startOfWeek;

     while (day <= endOfWeek) {
        days.push(day);
        day = day.clone().add(1, 'd');
     }
     return days
  }

    const renderDataLinear = (dateSelected : Moment) => {
      var canvas = document.createElement("canvas");
      var chart = canvas.getContext("2d");
      let gradient = chart?.createLinearGradient(0, 0, 0, 450);

      gradient?.addColorStop(0, "rgba(250, 160, 95,0.64)");
      gradient?.addColorStop(0.5, "rgba(250, 160, 95,0.32)");
      gradient?.addColorStop(1, "rgba(250, 160, 95,0)");
      // Variable
      let date = dateSelected.clone()
      let year = date.year()
      let month = date.month()+1
      // List days in week
      const weeksOfday = getListDaysInWeek(date);
      // labels days in week
      let labelDays = Array.apply(null, Array(7)).map(function (_, i) {
        return i + 2 === 8 ? 'CN' : `Thứ ${i+2}`;
      });
      // list week of month
      let weekArray = [];
      for (let i = 0; i < 4; i++) {
        let obj = {
          startDay :moment(new Date(year, month - 1, 7 * i + 1)),
          endDay: moment(new Date(year, month - 1, 7 * i + 7))
        };
          weekArray.push(obj);
      }
      // Labels week
      let labelWeeks = weekArray.map((item)=>{
        return `${item.startDay.format('DD/MM')} - ${item.endDay.format('DD/MM')}`
      })
      //Cacluator money earn incoming
      let labels :any[]= [];
      let data = [33, 53, 85, 41, 44, 65];
      switch (filter) {
        case "day":
          var temp = weeksOfday?.reduce((curr:number[], next) => {
            let list = tickets?.filter(
              (ticket) =>{
                let temp = moment((ticket.dateRelease as any).toDate())
                return  temp.format('DDMMYYYY') === next.format('DDMMYYYY')
            });
            let moneyEarn = list?.reduce((curr,next)=> {
              let index = packages?.findIndex(item=>item.codePackage === next.codePackage)
              if(index !== -1 && packages){
                let price = packages[index as any].singleTicketPrice
                return curr + price
              }
              return curr
            },0)
            curr.push(moneyEarn || 0);
            return [...curr];
          }, []);
          labels = [...labelDays];
          data = [...temp];
          break;
        case "week":
          var temp = weekArray?.reduce((curr:number[], next) => {
            let list = tickets?.filter(
              (ticket) =>{
                let temp = moment((ticket.dateRelease as any).toDate())
                return  temp.isAfter(next.startDay) && temp.isBefore(next.endDay)
            });
            let moneyEarn = list?.reduce((curr,next)=> {
              let index = packages?.findIndex(item=>item.codePackage === next.codePackage)
              if(index !== -1 && packages){
                let price = packages[index as any].singleTicketPrice
                return curr + price
              }
              return curr
            },0)
            curr.push(moneyEarn || 0);
            return [...curr];
          }, []);
          labels = [...labelWeeks];
          data = [...temp];
          break;
        default:
          break;
      }

      return {
        labels: labels,
        datasets: [
          {
            label: "Số đã cấp (lượt)",
            data: data,
            fill: true,
            backgroundColor: gradient,
            borderColor: "#FAA05F",
            pointStyle: "circle",
            pointRadius: 0,
            pointBorderWidth: 3,
            pointBorderColor: "#fff",
            pointBackgroundColor: "#FAA05F",
          },
        ],
      };
    };
    const handeChangeFilter = (values: any)=>{
      setFilter(values.target.value)
    }
    const handleDateLinearChange = (date: any, dateString : string)=>{
      setDateSelected(date)
    }
    const handleDateDognutChange = (date: any, dateString : string)=>{
      setDateDognutSelected(date)
    }
    const handeChangeFilterDognut = (values: any)=>{
      setFilterDognut(values.target.value)
    }
    const renderDataDoughnut = (dateSelected : Moment,codePackage : string) => {
      // Variable
      let date = dateSelected.clone()
      var startOfWeek = date.clone().startOf('isoWeek');
      var endOfWeek = date.clone().endOf('isoWeek');
      
      let labels :any[]= ['Chưa sử dụng', 'Đã sử dụng'];
      let data = [33, 53];
      switch (filterDognut) {
        case "day":
            let listUsed :any[]=[]
            let listPending :any[]=[]
            tickets?.forEach(
              (ticket) =>{
                let temp = moment((ticket.dateRelease as any).toDate())
                if(temp.format('DDMMYYYY') ===  date.format('DDMMYYYY') && ticket.codePackage === codePackage){
                  if(ticket.dateUsed){
                   // Đã sử dụng
                    listUsed.push(ticket)
                   }else{
                  // Chưa sử dụng
                    listPending.push(ticket)
                   }
                }
            });
      
            let moneyEarnUsed = listUsed?.reduce((curr,next)=> {
              let index = packages?.findIndex(item=>item.codePackage === next.codePackage)
              if(index !== -1 && packages){
                let price = packages[index as any].singleTicketPrice
                return curr + price
              }
              return curr
            },0)
            let moneyEarnPending = listPending?.reduce((curr,next)=> {
              let index = packages?.findIndex(item=>item.codePackage === next.codePackage)
              if(index !== -1 && packages){
                let price = packages[index as any].singleTicketPrice
                return curr + price
              }
              return curr
            },0)
          data = [moneyEarnPending,moneyEarnUsed];
          break;
        case "week":
            let listUsed2 :any[]=[]
            let listPending2 :any[]=[]
            tickets?.forEach(
              (ticket) =>{
                let temp = moment((ticket.dateRelease as any).toDate())
                if(temp.isAfter(startOfWeek) && temp.isBefore(endOfWeek)  && ticket.codePackage === codePackage){
                   if(ticket.dateUsed){
                   // Đã sử dụng
                   listUsed2.push(ticket)
                   }else{
                  // Chưa sử dụng
                  listPending2.push(ticket)
                   }
                }
            });
      
            let moneyEarnUsed2 = listUsed2?.reduce((curr,next)=> {
              let index = packages?.findIndex(item=>item.codePackage === next.codePackage)
              if(index !== -1 && packages){
                let price = packages[index as any].singleTicketPrice
                return curr + price
              }
              return curr
            },0)
            let moneyEarnPending2 = listPending2?.reduce((curr,next)=> {
              let index = packages?.findIndex(item=>item.codePackage === next.codePackage)
              if(index !== -1 && packages){
                let price = packages[index as any].singleTicketPrice
                return curr + price
              }
              return curr
            },0)
          data = [moneyEarnPending2,moneyEarnUsed2];
          break;
        default:
          break;
      }
      return {
        labels: labels,
        datasets: [
          {
            label: "",
            data: data,
            fill: true,
            pointRadius: 0,
            pointBorderWidth: 0,
            backgroundColor: [
              '#FF8A48',
              '#4F75FF'
            ],
          },
        ],
      };
    };
    const calcTotalMoney = ()=>{
        let sum = 0
      if(donutInfo){
        sum = donutInfo.reduce((curr:number, next:any)=>{
          let { data } = next.datasets[0]
          return curr + data[0] + data[1]
        },0)
      }
      return sum
    }
    const formatMoney = (money: number)=>{
      if(money == 0){
        return 0
      }else{
        let price = calcTotalMoney().toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})
        return price.substring(0,price.length-2)
      }
    }
  return (
    <div className='dashboard_content'>
      <h1 className="text-4xl font-bold mb-8 2xl:text-xl">Thống kê</h1>
      <div className="flex items-center w-full mb-6">
        <span className='text-lg font-semibold 2xl:text-sm'>Doanh thu</span>
        <DatePicker className=' ml-auto rounded-lg w-[150px] h-11 text-primary-gray-400'
        onChange={handleDateLinearChange}
        dropdownClassName='custom-date'
        format={"DD/MM/YYYY"}
        value={dateSelected}
        locale={locale} 
        renderExtraFooter={()=>{
            return <div className='py-5'>
              <Radio.Group defaultValue={'day'} className='flex justify-between' onChange={handeChangeFilter}>
                <div className="">
                <Radio value={'day'}/>
                <span className='text-sm ml-2'>Theo ngày</span>
                </div>
                <div className="">
                <Radio value={'week'}/>
                <span className='text-sm ml-2'>Theo tuần</span>
                </div>
              </Radio.Group>
            </div>
          }}
        />
      </div>
      
     {dateSelected && tickets  &&  <Line  data={renderDataLinear(dateSelected) as any} options={options as any} />}
    <h3 className='text-sm text-opacity-50 mt-10 2xl:text-xs'>Tổng doanh thu theo {filterDognut === 'day' ? 'ngày' : 'tuần'}</h3>
    <h2 className='text-2xl font-bold mb-20 2xl:text-lg'>{donutInfo && formatMoney(calcTotalMoney())}<span className='text-sm'>đồng</span></h2>
    <div className='flex w-full gap-x-28 lg:flex-col lg:justify-center lg:items-center'>
      <DatePicker className='ml-auto rounded-lg w-[150px] h-11 text-primary-gray-400 shrink-0'
        onChange={handleDateDognutChange}
        dropdownClassName='custom-date'
        format={"DD/MM/YYYY"}
        value={dateDognutSelected}
        locale={locale} 
        renderExtraFooter={()=>{
            return <div className='py-5'>
              <Radio.Group defaultValue={'day'} className='flex justify-between' onChange={handeChangeFilterDognut}>
                <div className="">
                <Radio value={'day'}/>
                <span className='text-sm ml-2'>Theo ngày</span>
                </div>
                <div className="">
                <Radio value={'week'}/>
                <span className='text-sm ml-2'>Theo tuần</span>
                </div>
              </Radio.Group>
            </div>
          }}
        />
        {
        packages && donutInfo && packages.map((item,index)=>{
          return (donutInfo[index] &&
            <div key={item.id} className="w-1/4 flex flex-col items-center">
            <h2 className='font-semibold text-lg mb-6 2xl:text-sm'>{item.namePackage}</h2>
            {dateSelected && tickets &&  <Doughnut
            options={
              optionsDonut as any
            } data={donutInfo[index]}/>}
            </div>
          )
        })
      }
        <div className="w-1/4 pt-[50px]">
          <div className="flex items-center gap-x-2 mb-[18px] 2xl:text-sm">
            <div className='w-11 h-5 bg-[#4F75FF] rounded '></div>
            Vé đã sử dụng
          </div>
          <div className="flex items-center gap-x-2 2xl:text-sm">
            <div className='w-11 h-5 bg-[#FF8A48] rounded'></div>
            Vé chưa sử dụng
          </div>
        </div>
    </div>
    </div>
  )
}

export default Dashboard