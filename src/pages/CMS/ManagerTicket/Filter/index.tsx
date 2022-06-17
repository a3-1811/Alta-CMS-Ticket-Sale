import { Checkbox, Col, DatePicker, Form, Radio, Row ,Button, Space} from "antd";
import moment from "moment-timezone";
import React, { useEffect, useRef, useState } from "react";
import "./style.scss";
type Props = {
  handlePopup: Function;
  handleReceiveFilter: Function;
  isOpen: boolean;
};

const FilterTicket = ({ handlePopup, handleReceiveFilter, isOpen }: Props) => {
    const outSideRef = useRef(null)
  const [time, setTime] = useState({
    startDay: moment(),
    endDay: moment().add(7, "days"),
  });
  const [form] = Form.useForm();
  const [checkBoxStatus, setcheckBoxStatus] = useState<boolean>(false)
  useEffect(() => {
    form.setFieldsValue({
      tinhTrang: "all",
      congCheckin: ["1"],
    });
  }, []);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event : any) {
      if (outSideRef.current ) {
        let temp :any= outSideRef.current
        console.log()
        if(!temp.contains(event.target) && isOpen && !Number.isInteger(+event.target.innerHTML)){
            handlePopup(false)
        }
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [outSideRef,isOpen]);

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
  const onFinish = (values: any) => {
    handleReceiveFilter({...values,time})
    handlePopup(false)
  };
  const checkBoxOnchange = (values: any[])=>{
    //Set lại form, cập nhật checkbox status
    if(values.includes('all')){
        let data = {...form.getFieldsValue(),congCheckin : ['all']}
        form.setFieldsValue(data)
        setcheckBoxStatus(true)
    }else{
          setcheckBoxStatus(false)
    }
  }
  return (
    <div
    ref={outSideRef}
      className={`${
        isOpen ? "block" : "hidden"
      } filter-ticket fixed top-1/2 left-1/2 min-w-[634px] -translate-y-3/4 -translate-x-1/2 rounded-2xl bg-white px-8 py-6`}
    >
      <h2 className="text-center font-bold text-2xl mb-[27px]">Lọc vé</h2>
      <Form name="nest-messages" onFinish={onFinish} form={form}>
        <div className="w-full flex items-center mb-[20px]">
          <div className="flex flex-col  gap-y-6 w-1/2 text-base font-semibold">
            Từ ngày
            <DatePicker
              name="day"
              onChange={handleStartDateChange}
              className="rounded-lg w-[150px] h-11 text-primary-gray-400"
              format={"DD/MM/YYYY"}
              value={time.startDay}
            />
          </div>
          <div className="flex flex-col  gap-y-6 w-1/2 text-base font-semibold">
            Đến ngày
            <DatePicker
              name="day"
              disabledDate={disabledDate}
              onChange={handleEndDateChange}
              className="rounded-lg w-[150px] h-11 text-primary-gray-400"
              format={"DD/MM/YYYY"}
              value={time.endDay}
            />
          </div>
        </div>
        <h2 className="font-semibold text-base mb-[9px]">Tình trạng sử dụng</h2>
        <Form.Item name="tinhTrang" className="mb-[20px]">
          <Radio.Group className="w-full"
          >
            <Row className="w-full">
              <Col span={4}>
                <Radio value="all">Tất cả</Radio>
              </Col>
              <Col span={7}>
                <Radio value="used">Đã sử dụng</Radio>
              </Col>
              <Col span={8}>
                <Radio value="pending">Chưa sử dụng</Radio>
              </Col>
              <Col span={5}>
                <Radio value="expired">Hết hạn</Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Form.Item>
        <h2 className="font-semibold text-base mb-[8px]">Cổng Check - in</h2>
        <Form.Item name="congCheckin">
          <Checkbox.Group className="w-full"
            onChange={checkBoxOnchange}
          >
            <Row className="w-full">
              <Col span={8}>
                <Checkbox value="all" style={{ lineHeight: "32px" }}>
                  Tất cả
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="1" style={{ lineHeight: "32px" }} disabled={checkBoxStatus}>
                  Cổng 1
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="2" style={{ lineHeight: "32px" }} disabled={checkBoxStatus}>
                  Cổng 2
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="3" style={{ lineHeight: "32px" }} disabled={checkBoxStatus}>
                  Cổng 3
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="4" style={{ lineHeight: "32px" }} disabled={checkBoxStatus}>
                  Cổng 4
                </Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="5" style={{ lineHeight: "32px" }} disabled={checkBoxStatus}>
                  Cổng 5
                </Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </Form.Item>
        <Space
        className="w-full items-center justify-center"
        >
        <Button
        className="mt-[20px] btn w-[160px] h-[50px] hover:border-yellow/1 hover:text-yellow/1 font-bold text-lg"
        htmlType="submit"
        >   
            Lọc
        </Button>
        </Space>
      </Form>
    </div>
  );
};

export default FilterTicket;
