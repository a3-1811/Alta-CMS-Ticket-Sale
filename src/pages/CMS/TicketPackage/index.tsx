import { FilterIcon, PencilAltIcon, SearchIcon } from "@heroicons/react/outline";
import { Table } from "antd";
import { AlignType } from 'rc-table/lib/interface';
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import './style.scss';
import AddPackage from "./AddPackage";
import UpdatePackage from "./UpdatePackage";
type Props = {};

const TicketPackage = (props: Props) => {
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
  const [isOpenAdd , setIsOpenAdd ] = useState<boolean>(false)
  const [isOpenUpdate , setIsOpenUpdate ] = useState<boolean>(false)
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: "5%",
    },
    {
      title: "Mã gói",
      dataIndex: "codePackage",
      width: "7%",
    },
    {
      title: "Tên gói vé",
      dataIndex: "namePackage",
      width: "8%",
      render: (nameEvent: string) => {
        return <p className="limit-1">{nameEvent}</p>;
      },
    },
    {
      title: "Ngày áp dụng",
      dataIndex: "dateApply",
      width: "10%",
      render: (dateApply:any)=>{
        return <span>{dateApply.format('DD/MM/YYYY')}<br></br>{dateApply.format('HH:mm:ss')}</span>
      },
      align: 'right' as AlignType
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "dateExpire",
      width: "10%",
      render: (dateExpire:any)=>{
        return <span>{dateExpire.format('DD/MM/YYYY')}<br></br>{dateExpire.format('HH:mm:ss')}</span>
      },
      align: 'right' as AlignType
    },
    {
      title: "Giá vé (VNĐ/Vé)",
      dataIndex: "singleTicketPrice",
      width: "10%",
      render: (singleTicketPrice:any)=>{
        let price = singleTicketPrice.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})
        return <span>{price.substring(0,price.length-2)} VNĐ</span>
      },
      align: 'right' as AlignType
    },
    {
      title: "Giá Combo (VNĐ/Combo)",
      dataIndex: "comboTicketPrice",
      width: "10%",
      render: (comboTicketPrice:any)=>{
        let price = comboTicketPrice.price.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})
        return <span>{price.substring(0,price.length-2)} VNĐ/ {comboTicketPrice.amount} vé</span>
      }
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      width: "10%",
      render: (status: any) =>
         status === "applying" ? (
          <span className="inline-block">
            <span className="flex items-center gap-x-2 px-[7px] py-2 rounded bg-grey-background text-promomote border border-promomote">
              <span className="shrink-0 block h-2 w-2 bg-promomote rounded-full"></span>
              Đang áp dụng
            </span>
          </span>
        ) : (
          <span className="inline-block">
            <span className="flex items-center gap-x-2 px-[7px] py-2 rounded bg-red-background text-primary-red border border-primary-red">
              <span className="shrink-0 block h-2 w-2 bg-primary-red rounded-full"></span>
              Tắt
            </span>
          </span>
        ),
    },
    {
      title: "",
      dataIndex: "action",
      width: "10%",
      render: (number:any,record:any)=>{
          return <span onClick={()=>{handlePopupUpdate()}} className="flex text-yellow/1 items-center gap-x-1 cursor-pointer"><PencilAltIcon className="w-[18px] h-[36px] cursor-pointer"/> Cập nhật</span>
      }
    }
  ];
  useEffect(() => {
    //Data demo
    const data = [];
    for (let index = 0; index < 50; index++) {
      let random = Math.floor(Math.random() * (10 - 1 + 1) + 1);
      let temp = {
        key: index,
        stt: index,
        codePackage: `ALT20210501`,
        namePackage: "Gói gia đình",
        status: random % 2 === 0 ? "applying" : "off",
        dateApply: moment(),
        dateExpire: moment().set("day", moment().get("day") + 1),
        singleTicketPrice: random *10000,
        comboTicketPrice: {
          price : random *100000 / 2,
          amount : 4
        },

      };
      data.push(temp);
    }
    setTickets(data as any)
    setTicketsFilter(data as any)
    setTable({ ...table, data: data as any });
  }, []);
  const handlePanigationChange = (current: any) => {
    setTable({ ...table, pagination: { ...table.pagination, current } });
  };
  
  const handleKeyWordChange = (e: any)=>{
    let value= e.target.value
    setKey(value)
  if(searchRef){
    clearInterval(searchRef.current as any)
  }
  searchRef.current = setTimeout(() => {
   let temp = ticketsFilter.filter((item : any)=>{
    return item.numberTicket.includes(value)
   }
   )
    setTable({...table,data : temp as any})
    clearInterval(searchRef.current as any)
  }, 700);
  }
  // Add Popup
  const handlePopupAdd = ()=>{
    setIsOpenAdd(true)
  }
  const handleStatusAdd = (status: boolean)=>{
    setIsOpenAdd(status)
  }
  // Update Popup
  const handlePopupUpdate = ()=>{
    setIsOpenUpdate(true)
  }
  const handleStatusUpdate = (status: boolean)=>{
    setIsOpenUpdate(status)
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
          <div className="btn cursor-pointer">Xuất file (.csv)</div>
          <div className="btn fill cursor-pointer" onClick={handlePopupAdd}>
            Thêm gói vé
          </div>
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
    <AddPackage isOpen={isOpenAdd} handlePopup={handleStatusAdd}/>
    <UpdatePackage isOpen={isOpenUpdate} handlePopup={handleStatusUpdate}/>
    </>
  );
};

export default TicketPackage;
