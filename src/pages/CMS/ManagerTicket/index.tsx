import { FilterIcon, SearchIcon } from "@heroicons/react/outline";
import { Table } from "antd";
import React, { useEffect, useState } from "react";

type Props = {};

const columns = [
  {
    title: "Mã thiết bị",
    dataIndex: "maThietBi",
    width: "12%",
  },
  {
    title: "Tên thiết bị",
    dataIndex: "tenThietBi",
    width: "12%",
  },
  {
    title: "Địa chỉ IP",
    dataIndex: "ip",
    width: "10%",
  },
  {
    title: "Trạng thái hoạt động",
    dataIndex: "trangThai",
    width: "18%",
    render: (trangThai: any) =>
      trangThai ? (
        <span className="flex items-center gap-x-2">
          <span className="block h-2 w-2 bg-primary-green-500 rounded-full"></span>{" "}
          Hoạt động
        </span>
      ) : (
        <span className="flex items-center gap-x-2">
          <span className="block h-2 w-2 bg-primary-red rounded-full"></span>
          Ngưng hoạt động
        </span>
      ),
  },
  {
    title: "Trạng thái kết nối",
    dataIndex: "ketNoi",
    width: "15%",
    render: (ketNoi: any) =>
      ketNoi ? (
        <span className="flex items-center gap-x-2">
          <span className="block h-2 w-2 bg-primary-green-500 rounded-full"></span>{" "}
          Kết nối
        </span>
      ) : (
        <span className="flex items-center gap-x-2">
          <span className="block h-2 w-2 bg-primary-red rounded-full"></span>
          Mất kết nối
        </span>
      ),
  },
];

const ManagerTicket = (props: Props) => {
  const [table, setTable] = useState({
    data: [],
    pagination: {
      current: 1,
      pageSize: 9,
    },
    loading: false,
  });
  useEffect(() => {
    //Data demo
    const data = [];
    for (let index = 0; index < 50; index++) {
      let temp = {
        key: index,
        maThietBi: `KIO_0${index}`,
        tenThietBi: `Kiosk ${index}`,
        ip: "192.168.1.10",
        trangThai: index % 2 === 0 ? true : false,
        ketNoi: index % 2 === 0 ? true : false,
        dichVuSuDung: [
          "Khám tim mạch",
          "Khám Sản - Phụ khoa",
          "Khám răng hàm mặt",
          "Khám tai mũi họng",
          "Khám hô hấp",
          "Khám tổng quát",
        ],
      };
      data.push(temp);
    }

    setTable({ ...table, data: data as any });
  }, []);
  const handlePanigationChange = (current: any) => {
    setTable({ ...table, pagination: { ...table.pagination, current } });
  };
  return (
    <div className="manager-ticket">
      <h1 className="text-4xl font-bold mb-8">Danh sách vé</h1>
      {/* Controls */}
      <div className="flex items-center mb-8">
        <div className="relative w-[360px]">
          <input
            type="text"
            placeholder="Tìm bằng số vé"
            className="py-[10px] pl-4 pr-[60px] w-[360px] bg-[#EDE6E6] rounded-xl text-base 3xl:text-sm 2xl:text-xs"
          />
          <label className="absolute right-5 top-[10px] cursor-pointer h-6 w-6 2xl:top-[5px]">
            <SearchIcon className="text-xl font-light 3xl:text-sm 2xl:text-xs" />
          </label>
        </div>
        <div className="flex gap-x-[10px] ml-auto">
          <div className="btn flex items-center">
            <FilterIcon className="w-[26px] mr-3" /> Lọc vé
          </div>
          <div className="btn">Xuất file (.csv)</div>
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
          nextIcon: (status: any)=>{
            if(status.disabled){
                return <i className="fa fa-caret-right text-grey/4 text-lg"></i>
            }else{
                return <i className="fa fa-caret-right text-yellow/1 text-lg"></i>
            }
          },
          prevIcon:(status: any)=>{
            if(status.disabled){
                return <i className="fa fa-caret-left text-grey/4 text-lg"></i>
            }else{
                return <i className="fa fa-caret-left text-yellow/1 text-lg"></i>
            }
          }
        }}
        loading={table.loading}
      />
    </div>
  );
};

export default ManagerTicket;
