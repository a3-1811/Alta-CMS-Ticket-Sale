import { FilterIcon, PencilAltIcon, SearchIcon } from "@heroicons/react/outline";
import { Table } from "antd";
import { AlignType } from 'rc-table/lib/interface';
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import './style.scss';
import CsvDownloader from 'react-csv-downloader';
import PackageTicketService from "../../../db/services/package.services";
import IPackageTicket from "../../../db/types/package.type";
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
  const [tickets, setTickets] = useState<IPackageTicket[]>([])
  const [ticketsFilter, setTicketsFilter] = useState([])
  const [packageTicket, setPackageTicket] = useState<IPackageTicket>()

  const [isOpenAdd , setIsOpenAdd ] = useState<boolean>(false)
  const [isOpenUpdate , setIsOpenUpdate ] = useState<boolean>(false)
  const [excelExport, setExcelExport] = useState<any>()
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
        return <span>{moment(dateApply.toDate()).format('DD/MM/YYYY')}<br></br>{moment(dateApply.toDate()).format('HH:mm:ss')}</span>
      },
      align: 'right' as AlignType
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "dateExpire",
      width: "10%",
      render: (dateExpire:any)=>{
        return <span>{moment(dateExpire.toDate()).format('DD/MM/YYYY')}<br></br>{moment(dateExpire.toDate()).format('HH:mm:ss')}</span>
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
        if(comboTicketPrice){
          let price = comboTicketPrice.price.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})
          return <span>{price.substring(0,price.length-2)} VNĐ/ {comboTicketPrice.amount} vé</span>
        }
        else{
          return ''
        }
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
          return <span onClick={()=>{handlePopupUpdate(record.id)}} className="flex text-yellow/1 items-center gap-x-1 cursor-pointer"><PencilAltIcon className="w-[18px] h-[36px] cursor-pointer"/> Cập nhật</span>
      }
    }
  ];
  const excelColumns = [
    {
      displayName: "STT",
      id: "stt",
    },
    {
      displayName: "Mã gói",
      id: "codePackage",
    },
    {
      displayName: "Tên gói vé",
      id: "namePackage",
    },
    {
      displayName: "Ngày áp dụng",
      id: "dateApply",
    },
    {
      displayName: "Ngày hết hạn",
      id: "dateExpire",
    },
    {
      displayName: "Giá vé (VNĐ/Vé)",
      id: "singleTicketPrice",
    },
    {
      displayName: "Giá Combo (VNĐ/Combo)",
      id: "comboTicketPrice",
    },
    {
      displayName: "Tình trạng",
      id: "status",
    },
  ]
  useEffect(() => {
    //Data demo
   (async()=>{
    let data = await PackageTicketService.getPackageTickets()
    data = data.map((item,index)=>{
      return {
        ...item,key: item.id,
        stt : index+1
      }
    })
    setTickets(data as any)
    setTicketsFilter(data as any)
    setTable({ ...table, data: data as any });
    let excelData = data.map((item)=>{
      let price = item.comboTicketPrice?.price.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})
      let expire = (item.dateExpire as any)
      let apply = (item.dateApply as any)
      return{
        ...item,
        dateExpire: `${moment(expire.toDate()).format('DD/MM/YYYY HH:mm:ss')}`,
        dateApply: `${moment(apply.toDate()).format('DD/MM/YYYY HH:mm:ss')}`,
        singleTicketPrice : item.singleTicketPrice.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'}),
        comboTicketPrice : item.comboTicketPrice ? `${price} / ${item.comboTicketPrice?.amount} vé` : '_',
        status: item.status === "applying" ? "Đang áp dụng" : "Tắt" 
      }
    })
    setExcelExport({
      columns: excelColumns,
      datas:[...excelData]
    })
   })()
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
    return item.codePackage.includes(value)
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
  const handlePopupUpdate = (id: string)=>{
    let index = ticketsFilter.findIndex((item: any)=>{
      return item.id === id
    })
    if(index !== -1){
      setPackageTicket(ticketsFilter[index] as any)
      setIsOpenUpdate(true)
    }
  }
  const handleStatusUpdate = (status: boolean)=>{
    setIsOpenUpdate(status)
  }

  const reset = async()=>{
    let data = await PackageTicketService.getPackageTickets()
    data = data.map((item,index)=>{
      return {
        ...item,key: item.id,
        stt : index+1
      }
    })
    setTickets(data as any)
    setTicketsFilter(data as any)
    setTable({ ...table, data: data as any });
  }
  return (
    <>
    <div className="manager-ticket">
      <h1 className="text-4xl font-bold mb-8 2xl:text-lg">Danh sách gói vé</h1>
      {/* Controls */}
      <div className="flex items-center mb-8 lg:flex-col lg:items-center lg:gap-y-5">
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
        <div className="flex gap-x-[10px] ml-auto lg:ml-0">
          <CsvDownloader 
          filename="Bao_cao_goi_su_kien"
          extension=".csv"
          separator=";"
          wrapColumnChar=""
          columns={excelExport?.columns}
          datas={excelExport?.datas} 
          >
            <div className="btn cursor-pointer 2xl:text-xs">Xuất file (.csv)</div>
          </CsvDownloader>
          <div className="btn fill cursor-pointer 2xl:text-xs" onClick={handlePopupAdd}>
            Thêm gói vé
          </div>
        </div>
      </div>
      {/* Table */}
      <Table
        className="mt-4 xl:overflow-x-scroll"
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
    <AddPackage reset={reset} isOpen={isOpenAdd} handlePopup={handleStatusAdd}/>
    {<UpdatePackage reset={reset} packageTicket={packageTicket} isOpen={isOpenUpdate} handlePopup={handleStatusUpdate}/>}
    </>
  );
};

export default TicketPackage;
