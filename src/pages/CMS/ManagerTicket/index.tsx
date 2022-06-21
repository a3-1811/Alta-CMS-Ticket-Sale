import { FilterIcon, SearchIcon } from "@heroicons/react/outline";
import { Table } from "antd";
import { AlignType } from 'rc-table/lib/interface';
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import FilterTicket from "./Filter";
import './style.scss';
import { DotsVerticalIcon } from "@heroicons/react/outline";
import ChangeDateExpire from "./ChangeDateExpire";
import TicketServices from "../../../db/services/ticket.services";
import ITicket from "../../../db/types/ticket.type";
type Props = {};

const ManagerTicket = (props: Props) => {
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [key, setKey]= useState('') 
  const [table, setTable] = useState({
    data: [],
    pagination: {
      current: 1,
      pageSize: 9,
    },
    loading: false,
  });
  const [tickets, setTickets] = useState([])
  const [ticketsFilter, setTicketsFilter] = useState([])
  const [isOpen , setIsOpen ] = useState<boolean>(false)
  const [isOpenChangeExpire , setIsOpenChangeExpire ] = useState<boolean>(false)
  const [ticketPopup, setTicketPopup] = useState<ITicket>()
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: "5%",
    },
    {
      title: "Booking code",
      dataIndex: "codeBooking",
      width: "7%",
    },
    {
      title: "Số vé",
      dataIndex: "numberTicket",
      width: "7%",
    },
    {
      title: "Tên sự kiện",
      dataIndex: "nameEvent",
      width: "15%",
      render: (nameEvent: string) => {
        return <p className="limit-1">{nameEvent}</p>;
      },
    },
    {
      title: "Tình trạng sử dụng",
      dataIndex: "status",
      width: "10%",
      render: (status: any) =>
        status === "used" ? (
          <span className="inline-block">
            <span className="flex items-center  gap-x-2 px-[7px] py-2 rounded bg-grey-background text-grey/5 border border-grey/5">
              <span className="shrink-0 block h-2 w-2 bg-grey/5 rounded-full"></span>
              Đã sử dụng
            </span>
          </span>
        ) : status === "pending" ? (
          <span className="inline-block">
            <span className="flex items-center gap-x-2 px-[7px] py-2 rounded bg-grey-background text-promomote border border-promomote">
              <span className="shrink-0 block h-2 w-2 bg-promomote rounded-full"></span>
              Chưa sử dụng
            </span>
          </span>
        ) : (
          <span className="inline-block">
            <span className="flex items-center gap-x-2 px-[7px] py-2 rounded bg-red-background text-primary-red border border-primary-red">
              <span className="shrink-0 block h-2 w-2 bg-primary-red rounded-full"></span>
              Hết hạn
            </span>
          </span>
        ),
    },
    {
      title: "Ngày sử dụng",
      dataIndex: "dateUsed",
      width: "10%",
      render: (dateUsed:any)=>{
        if(dateUsed){
          return <span>{moment(dateUsed.toDate()).format('DD/MM/YYYY')}</span>
        }else{
          return <span className="text-lg">-</span>
        }
      },
      align: 'right' as AlignType
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "dateExpire",
      width: "10%",
      render: (dateExpire:any)=>{
        return <span>{moment(dateExpire.toDate()).format('DD/MM/YYYY')}</span>
      },
      align: 'right' as AlignType
    },
    {
      title: "Cổng check - in",
      dataIndex: "gateCheckin",
      width: "10%",
      render: (number:any)=>{
        if(number){
          return <span>Cổng {number}</span>
        }else{
          return <span className="text-lg">-</span>
        }
      }
    },
    {
      title: "",
      dataIndex: "action",
      width: "5%",
      render: (number:any,record:any)=>{
        if(record.status === 'pending'){
          return <DotsVerticalIcon className="w-[18px] h-[36px] cursor-pointer" onClick={()=>{handlePopupExpire(record.id)}}/>
        }else{
          return ''
        }
      }
    }
  ];
  useEffect(() => {
   (async()=>{
    // TicketServices.generateTickets(5)
    let data = await TicketServices.getTickets()
    data = data.map((item,index)=>{
      return {
        ...item,
        key: item.id,
        stt: index + 1
      }
    })
    setTickets(data as any)
    setTicketsFilter(data as any)
    setTable({ ...table, data: data as any });
   })()       
  }, []);
  const reset = async()=>{
    let data = await TicketServices.getTickets()
    data = data.map((item,index)=>{
      return {
        ...item,
        key: item.id,
        stt: index + 1
      }
    })
    setTickets(data as any)
    setTicketsFilter(data as any)
    setTable({ ...table, data: data as any });
  }
  const handlePanigationChange = (current: any) => {
    setTable({ ...table, pagination: { ...table.pagination, current } });
  };
  const handlePopupStatus = (status: boolean):void=>{
    setIsOpen(status)
  };
  const handleReceiveFilter = ( filterResult : any):void=>{
    let {time, tinhTrang, congCheckin } = filterResult
    tinhTrang = tinhTrang === 'all' ? '': tinhTrang 
    congCheckin = congCheckin.includes('all') ? '' : congCheckin

    let result  = tickets.filter((ticket : any)=>{
      let dateUsed = ticket.dateRelease as  any
      if(dateUsed){
        let isValidDate = moment(dateUsed.toDate()).isBefore(time.endDay) && moment(dateUsed.toDate()).isAfter(time.startDay)
        return ticket.status.includes(tinhTrang) && isValidDate && ticket.numberTicket.includes(key)
      }else{
        return false
      }
    })
    if(congCheckin.length > 0){
      if(!congCheckin.includes('all')){
        result = result.filter((ticket : any)=>{
          return  congCheckin.findIndex((item : any)=> +item === ticket.gateCheckin) !== -1 && ticket.status.includes(tinhTrang)
        })
      }
    }
    setTicketsFilter(result)
    setTable({ ...table, data: result as any });
  };
  const handlePopUp = ()=>{
    setIsOpen(true)
  }
  // Input Search change
  const handleKeyWordChange = (e: any)=>{
    let value= e.target.value
    setKey(value)
  if(searchRef){
    clearInterval(searchRef.current as any)
  }
  searchRef.current = setTimeout(() => {
   let temp = ticketsFilter.filter((item : any)=>{
    return item.numberTicket.includes(value) || item.codeBooking.includes(value) 
   }
   )
    setTable({...table,data : temp as any})
    clearInterval(searchRef.current as any)
  }, 700);
  }
  // Handle Popup display
  const handlePopupExpire = (id :string)=>{
    let index = tickets.findIndex((item:any)=> item.id === id)
    if(index !== -1){
      setTicketPopup(tickets[index])
    }
    setIsOpenChangeExpire(true)
  }
  const handleStatusExpire= (status:boolean)=>{
    setIsOpenChangeExpire(status)
  }
  return (
    <>
    <div className="manager-ticket">
      <h1 className="text-4xl font-bold mb-8">Danh sách vé</h1>
      {/* Controls */}
      <div className="flex items-center mb-8">
        <div className="relative w-[360px]">
          <input
          onChange={handleKeyWordChange}
            type="text"
            placeholder="Tìm bằng số vé"
            className="py-[10px] pl-4 pr-[60px] w-[360px] bg-[#EDE6E6] rounded-xl text-base 3xl:text-sm 2xl:text-xs"
          />
          <label className="absolute right-5 top-[10px] cursor-pointer h-6 w-6 2xl:top-[5px]">
            <SearchIcon className="text-xl font-light 3xl:text-sm 2xl:text-xs" />
          </label>
        </div>
        <div className="flex gap-x-[10px] ml-auto">
          <div className="btn flex items-center cursor-pointer" onClick={handlePopUp}>
            <FilterIcon className="w-[26px] mr-3" /> Lọc vé
          </div>
          <div className="btn cursor-pointer">Xuất file (.csv)</div>
        </div>
      </div>
      {/* Table */}
      <Table
        className="mt-4"
        columns={columns}
        dataSource={table.data}
        pagination={{
          ...table.pagination,
          onChange: handlePanigationChange,
          position: ["bottomCenter"],
          nextIcon: (status: any) => {
            if (status.disabled) {
              return <i className="fa fa-caret-right text-grey/4 text-lg"></i>;
            } else {
              return (
                <i className="fa fa-caret-right text-yellow/1 text-lg"></i>
              );
            }
          },
          prevIcon: (status: any) => {
            if (status.disabled) {
              return <i className="fa fa-caret-left text-grey/4 text-lg"></i>;
            } else {
              return <i className="fa fa-caret-left text-yellow/1 text-lg"></i>;
            }
          },
        }}
        loading={table.loading}
      />
    </div>
    <FilterTicket isOpen={isOpen} handlePopup={handlePopupStatus} handleReceiveFilter={handleReceiveFilter} />
    <ChangeDateExpire reset={reset} ticket={ticketPopup} isOpen={isOpenChangeExpire} handlePopup={handleStatusExpire}/>
    </>
  );
};

export default ManagerTicket;
