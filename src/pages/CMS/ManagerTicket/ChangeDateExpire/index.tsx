import { Button, Col, DatePicker, Form, Modal, Row, Space } from 'antd';
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react'
import ITicket from "../../../../db/types/ticket.type";
import PackageServices from "../../../../db/services/package.services"
import TicketServices from "../../../../db/services/ticket.services"
import IPackage from "../../../../db/types/package.type";
import Swal from 'sweetalert2';

type Props = {
    handlePopup: Function;
    isOpen: boolean;
    ticket ?: ITicket;
    reset : Function;
}

type Info = {
  codeBooking ?: string,
  nameEvent ?: string,
  dateRelease?: Date,
  namePackage ?: string,
  dateExpired ?: Date,
  id?:string
}

const ChangeDateExpire = ({ handlePopup, isOpen, ticket,reset }: Props) => {
    const [time, setTime] = useState(moment());
    const [form] = Form.useForm();
    const [packageTickets, setPackageTickets] = useState<IPackage[]>()
    const [ticketInfo, setTicketInfo] = useState<Info>()

    useEffect(() => {
        if(ticket && packageTickets ){
          let {codeBooking,dateRelease,nameEvent,id,dateExpire} = ticket
        let index = packageTickets.findIndex((item)=>item.codePackage === ticket.codePackage)
        if(index !== -1){
          let release = dateRelease as any
          let expire = dateExpire as any
          setTicketInfo({
            codeBooking,
            nameEvent,
            dateRelease : release.toDate(),
            dateExpired : dateExpire,
            namePackage: packageTickets[index].namePackage,
            id
          })
          setTime(moment(expire.toDate()))
        }
        }
    }, [ticket,packageTickets]);

    useEffect(()=>{
      (async()=>{
        let data = await PackageServices.getPackageTickets()
        setPackageTickets(data)
      })()
    },[])
  

    const handleExpireDateChange = (date: any, dateString: String) => {
      setTime(date);
    };
    function disabledDate(current: any) {
      let temp = ticketInfo?.dateRelease as any
      return current < moment(temp);
    }
    const onFinish = async (values: any) => {
     if(ticket){
      await TicketServices.updateTicket({
        ...ticket,
        dateExpire : time.toDate(),
      })
      Swal.fire({
        title: 'Thành công!',
        text: 'Cập nhật ngày sử dụng vé thành công!',
        icon: 'success',
        confirmButtonText: 'Ok'
      }).then(()=>{
          handlePopup(false)
          reset()
      })
     }
    };
    return (
        <Modal
        centered
        visible={isOpen}
        className='bg-white filter-ticket min-w-[758px] rounded-xl'
        closable={false}
        footer={null}
        onCancel={()=>{handlePopup(false)}}
      >
        <h2 className="text-center font-bold text-2xl mb-[27px]">Đổi ngày sử dụng vé</h2>
        <Form name="nest-messages" onFinish={onFinish} form={form}>
            <Row  className='mb-[20px] text-base'>
                <Col span={8}>
                    Số vé
                </Col>
                <Col span={16}>
                    {ticketInfo?.codeBooking}
                </Col>
            </Row>
            <Row  className='mb-[20px] text-base'>
                <Col span={8}>
                    Loại vé
                </Col>
                <Col span={16}>
                  Vé cổng - {ticketInfo?.namePackage}
                </Col>
            </Row>
            <Row  className='mb-[20px] text-base'>
                <Col span={8}>
                Tên sự kiện
                </Col>
                <Col span={16}>
                  {ticketInfo?.nameEvent}
                </Col>
            </Row>
            <Row  className='mb-[20px] text-base items-center'>
                <Col span={8}>
                Hạn sử dụng
                </Col>
                <Col span={16}>
                <DatePicker
                disabledDate={disabledDate}
                onChange={handleExpireDateChange}
                className="rounded-lg w-[150px] h-11 text-primary-gray-400"
                format={"DD/MM/YYYY"}
                value={time}
              />
                </Col>
            </Row>
          <div
          className="flex w-full items-center justify-center gap-x-6"
          >
          <Button
          className="mt-[20px] btn w-[160px] h-[50px] hover:border-yellow/1 hover:text-yellow/1 font-bold text-lg"
            onClick={()=>{  handlePopup(false)}}
          >   
             Hủy
          </Button>
          <Button
          className="fill mt-[20px] btn w-[160px] h-[50px] hover:border-yellow/1 hover:text-white font-bold text-lg"
          htmlType="submit"
          >   
             Lưu
          </Button>
          </div>
        </Form>
      </Modal>
    );
}

export default ChangeDateExpire