import { FilterIcon, SearchIcon } from "@heroicons/react/outline";
import { Button, Col, DatePicker, Form, Radio, Row, Space, Table } from "antd";
import { AlignType } from 'rc-table/lib/interface';
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import TicketServices from "../../../db/services/ticket.services";
import ITicket from "../../../db/types/ticket.type";
import './style.scss';
import CsvDownloader from 'react-csv-downloader';
import CsvDownload from "react-csv-downloader";

type Props = {};

const CheckingTicket = (props: Props) => {
  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [key, setKey]= useState('') 
  const [form] = Form.useForm()
  const [excelExport, setExcelExport] = useState<any>()
  const [time, setTime] = useState({
    startDay: moment(),
    endDay: moment().add(7, "days"),
  });
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
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      width: "5%",
    },
    {
      title: "Số vé",
      dataIndex: "numberTicket",
      width: "10%",
    },
    {
      title: "Ngày sử dụng",
      dataIndex: "dateUsed",
      width: "10%",
      render: (dateUsed:any)=>{
        if(dateUsed){
          return <span>{moment(dateUsed.toDate()).format('DD/MM/YYYY')}</span>
        }
        return <span>-</span>
      },
      align: 'center' as AlignType
    },
    {
        title: "Tên loại vé",
        dataIndex: "nameTicket",
        width: "20%",
        render: (maLoai:any)=>{
          return <span>Vé cổng</span>
        },
      align: 'center' as AlignType
    },
    {
      title: "Cổng check - in",
      dataIndex: "gateCheckin",
      width: "15%",
      render: (number:any)=>{
        return <span>Cổng {number}</span>
      }
    },
    {
      title: "",
      dataIndex: "action",
      width: "15%",
      render: (number:any,record:any)=>{
        if(record.status === 'used'){
          return <span className="font-medium text-primary-red italic text-sm 2xl:text-xs">Đã đối soát</span>
        }else{
          return <span className="font-medium text-grey/4 italic text-sm 2xl:text-xs">Chưa đối soát</span>
        }
      },
      align: 'center' as AlignType
    }
  ];
  const excelColumns = [
    {
      displayName: "STT",
      id: "stt",
    },
    {
      displayName: "STT",
      id: "stt",
    },
    {
      displayName: "Số vé",
      id: "numberTicket",
    },
    {
      displayName: "Ngày sử dụng",
      id: "dateUsed",
    },
    {
      displayName: "Tên loại vé",
        id: "nameTicket",
    },
    {
      displayName: "Cổng check - in",
      id: "gateCheckin",
    },
    {
      displayName: "Tình trang đối soát",
      id: "doiSoat",
    }
  ]
  useEffect(() => {
    (async()=>{
      let data = await TicketServices.getTickets()
      data = data.map((item,index)=>{
        return {
          ...item,key :item.id,
          stt:index + 1
        }
      })
      setTickets(data as any)
      setTicketsFilter(data as any)
      setTable({ ...table, data: data as any });
      form.setFieldsValue({
          tinhTrang : 'all'
      })
    })()
  }, []);

  useEffect(()=>{
    if(table){
      let excelData = table.data.map((item:any)=>{
        let usedDate = (item.dateUsed as any)
        return{
          ...item,
          dateUsed: usedDate ? `${moment(usedDate.toDate()).format('DD/MM/YYYY HH:mm:ss')}` : '_',
          doiSoat: item.status === "used" ? "Đã đối soát" : "Chưa đối soát" ,
          nameTicket : 'Vé cổng',
          gateCheckin : 'Cổng' + item.gateCheckin
        }
      })
      setExcelExport({
        columns: excelColumns,
        datas:[...excelData]
      })
    }
  },[table])
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
    console.log(ticketsFilter)
   let temp = ticketsFilter.filter((item : any)=>{
    return item.numberTicket.includes(value)
   }
   )
    setTable({...table,data : temp as any})
    clearInterval(searchRef.current as any)
  }, 700);
  }
  const handleStartDateChange = (date: any, dateString: String) => {
    let temp = date.clone();
    if (date > time.endDay) {
      setTime({ startDay: temp, endDay: date.add(7, "days") });
    } else {
      setTime({ ...time, startDay: temp });
    }
  };
  const handleEndDateChange = (date: any, dateString: String) => {
    setTime({ ...time, endDay: date });
  };
  function disabledDate(current: any) {
    return current < time.startDay;
  }
  const onFinish = (values: any) =>{
    let {tinhTrang } = values
    tinhTrang = tinhTrang === 'all' ? '': tinhTrang 

    let result  = tickets.filter((ticket : any)=>{
      let releaseDate = ticket.dateRelease as any
      let isValidDate = moment(releaseDate.toDate()).isBefore(time.endDay) && moment(releaseDate.toDate()).isAfter(time.startDay)
      return ticket.status.includes(tinhTrang) && isValidDate && ticket.numberTicket.includes(key)
    })

    setTicketsFilter(result)
    setTable({ ...table, data: result as any });
  }
  return (
    <div className="checking-ticket w-full flex gap-x-6 2xl:flex-col">
      <div className="w-[70%] p-6 pb-[30px] bg-white rounded-3xl min-h-[87vh] 2xl:w-full">
      <h1 className="text-4xl font-bold mb-8 2xl:text-lg">Đối soát vé</h1>
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
          <div className="btn fill cursor-pointer 2xl:text-xs" >
            Chốt đối soát
          </div>
          <CsvDownload
          filename="bao_cao_doi_soat_ve"
          extension=".csv"
          separator=";"
          wrapColumnChar=""
          columns={excelExport?.columns}
          datas={excelExport?.datas}
          ><div className="btn cursor-pointer  2xl:text-xs">Xuất file (.csv)</div></CsvDownload>
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
      <div className="w-[30%] p-6 pb-[30px] bg-white rounded-3xl min-h-[87vh] 2xl:w-full 2xl:min-h-min">
        <h1 className="text-2xl font-bold mb-8 2xl:text-lg">Lọc vé</h1>
        <Form name="nest-messages" onFinish={onFinish} form={form}>
        <Form.Item name="tinhTrang" className="mb-[20px]">
          <Radio.Group className="w-full"
          >
            <Row className="w-full">
              <Col span={10}>
                <h2 className="font-semibold text-base 2xl:text-xs">Tình trạng đối soát</h2>
              </Col>
              <Col span={14}>
                <Radio className="mb-3 text-base 2xl:text-xs" value="all">Tất cả</Radio>
                <br></br>
                <Radio className="mb-3 text-base 2xl:text-xs" value="used">Đã đối soát</Radio>
                <br></br>
                <Radio className="text-base 2xl:text-xs" value="pending">Chưa đối soát</Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Form.Item>
        <Row className="w-full mb-6">
              <Col span={10}>
                <h2 className="font-semibold text-[16px] 2xl:text-xs">Loại vé</h2>
              </Col>
              <Col span={14} className="text-[16px] 2xl:text-xs">
                Vé cổng
              </Col>
        </Row>
        <Row className="w-full mb-6 items-center">
              <Col span={10}>
                <h2 className="font-semibold text-[16px] 2xl:text-xs">Từ ngày</h2>
              </Col>
              <Col span={14} className="text-[16px]">
              <DatePicker
              name="day"
              onChange={handleStartDateChange}
              className="rounded-lg w-full h-11 text-primary-gray-400 2xl:h-6 2xl:w-auto"
              format={"DD/MM/YYYY"}
              value={time.startDay}
            />
              </Col>
        </Row>
        <Row className="w-full mb-6 items-center">
              <Col span={10}>
                <h2 className="font-semibold text-[16px] 2xl:text-xs">Đến ngày</h2>
              </Col>
              <Col span={14} className="text-[16px]">
              <DatePicker
              name="day"
              disabledDate={disabledDate}
              onChange={handleEndDateChange}
              className="rounded-lg w-full h-11 text-primary-gray-400 2xl:h-6 2xl:w-auto"
              format={"DD/MM/YYYY"}
              value={time.endDay}
            />
              </Col>
        </Row>
        <Space
        className="w-full items-center justify-center"
        >
        <Button
        className="2xl:text-xs 2xl:h-10 mt-[20px] btn w-[160px] h-[50px] hover:border-yellow/1 hover:text-yellow/1 font-bold text-lg"
        htmlType="submit"
        >   
            Lọc
        </Button>
        </Space>
      </Form>
      </div>
    </div>
  );
};

export default CheckingTicket;
