import { Button, Col, DatePicker, Form, Modal, Row, Space } from 'antd';
import moment from 'moment-timezone';
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    handlePopup: Function;
    isOpen: boolean;
    id?: string;
}

const ChangeDateExpire = ({ handlePopup, isOpen, id }: Props) => {
    const [time, setTime] = useState(moment());
    const [form] = Form.useForm();
    useEffect(() => {
        // Display info
        // Fecth Api form firebase
    }, [id]);
  

    const handleExpireDateChange = (date: any, dateString: String) => {
      setTime(date);
    };
    function disabledDate(current: any) {
    //   return current < time.startDay;
    }
    const onFinish = (values: any) => {
      handlePopup(false)
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
                    PKG20210502
                </Col>
            </Row>
            <Row  className='mb-[20px] text-base'>
                <Col span={8}>
                    Loại vé
                </Col>
                <Col span={16}>
                    Vé cổng - Gói sự kiện
                </Col>
            </Row>
            <Row  className='mb-[20px] text-base'>
                <Col span={8}>
                Tên sự kiện
                </Col>
                <Col span={16}>
                Hội trợ triển lãm hàng tiêu dùng 2022
                </Col>
            </Row>
            <Row  className='mb-[20px] text-base items-center'>
                <Col span={8}>
                Hạn sử dụng
                </Col>
                <Col span={16}>
                <DatePicker
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