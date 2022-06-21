import React, { useEffect, useState } from 'react'
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
import { Line } from 'react-chartjs-2';
import { Checkbox, DatePicker, Radio } from 'antd';
import moment from 'moment-timezone';
import TicketServies from "../../../db/services/ticket.services";
import ITicket from "../../../db/types/ticket.type";

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
  },
  scale: {
    yAxes: [
      {
        type: "linear",
        position: "bottom",
        ticks: {
          max: 100,
          min: 0,
          stepSize: 1,
        },
      },
    ],
  },
};
type Props = {}

const Dashboard = (props: Props) => {
  const [dateSelected, setDateSelected] = useState(new Date())
  const [filter, setFilter] = useState('day')
  const [tickets, setTickets] = useState<ITicket[]>()
  useEffect(() => {
    (async()=>{
      let data = await TicketServies.getTickets()
      setTickets(data)
    })()
  }, [])
  
  const renderData = () => {
    var canvas = document.createElement("canvas");
    var chart = canvas.getContext("2d");
    let gradient = chart?.createLinearGradient(0, 0, 0, 450);

    gradient?.addColorStop(0, "rgba(206, 221, 255,1)");
    gradient?.addColorStop(0.5, "rgba(206, 221, 255,0.7)");
    gradient?.addColorStop(1, "rgba(206, 221, 255,0.3)");
    // Variable
    let date = dateSelected;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    const days = new Date(year, month, 0).getDate();
    let listDays = Array.from({ length: days }, (_, i) => i + 1);
    //Cacluator money earn incoming
    let labels :any[]= [];
    let data = [33, 53, 85, 41, 44, 65];
    switch (filter) {
      case "day":
        // // Caclulator day by day
        // var temp = listDays.reduce((curr:number[], next) => {
        //   let ProgressOfDay = progressions.filter(
        //     (progress) =>{
        //       let temp = progress.thoiGianCap as any
        //       return  new Date(temp.toDate()).getDate() === next &&
        //       new Date(temp.toDate()).getMonth() + 1 === month &&
        //       new Date(temp.toDate()).getFullYear() === year
        // });
        //   curr.push(ProgressOfDay.length);
        //   return [...curr];
        // }, []);
        // labels = [...listDays];
        // data = [...temp];
        break;
      case "week":
        // //day of week start of month
        // let weekArray = [];
        // for (let i = 0; i < 4; i++) {
        //   let obj = {startDay :new Date(year, month - 1, 7 * i + 1),
        //     endDay: new Date(year, month - 1, 7 * i + 7)};
        //     weekArray.push(obj);
        // }
        // // Caclulator week
        // var temp = weekArray.reduce((curr:number[], next) => {
        //   let numberOfDay = progressions.filter((progress) => {
        //     let temp = progress.thoiGianCap as any
        //     if (
        //       next.startDay <= new Date(temp.toDate()) &&
        //       next.endDay >= new Date(temp.toDate())
        //     ) {
        //       return true;
        //     }
        //     return false;
        //   });
        //   curr.push(numberOfDay.length);
        //   return [...curr];
        // }, []);
        // labels = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"];
        // data = [...temp];
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
          borderColor: "#5185F7",
          pointStyle: "circle",
          pointRadius: 6,
          pointBorderWidth: 3,
          pointBorderColor: "#fff",
          pointBackgroundColor: "#5185F7",
        },
      ],
    };
  };
    const handeChangeFilter = (values: any)=>{
      console.log(values.target.value)
    }
  return (
    <div className='dashboard_content'>
      <h1 className="text-4xl font-bold mb-8">Thống kê</h1>
      <div className="flex items-center w-full mb-6">
        <span className='text-lg font-semibold'>Doanh thu</span>
        <DatePicker className='ml-auto rounded-lg w-[150px] h-11 text-primary-gray-400'
        dropdownClassName='custom-date'
        format={"DD/MM/YYYY"}
        value={moment()}
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
      <Line data={renderData() as any} options={options as any} />
    </div>
  )
}

export default Dashboard