import {ChevronDownIcon } from "@heroicons/react/outline";
import { Checkbox, DatePicker, Form ,Button, Space, Modal, Input, TimePicker, Select, Col, Row} from "antd";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";
import PackageTicketService from "../../../../db/services/package.services";
import IPackageTicket from "../../../../db/types/package.type";
import Swal from "sweetalert2";
import "./style.scss";
type Props = {
  handlePopup: Function;
  isOpen: boolean;
  packageTicket?: IPackageTicket;
  reset : Function;
};
const { Option } = Select;
const UpdatePackage = ({ handlePopup, isOpen, packageTicket,reset }: Props) => {
  const [time, setTime] = useState({
    startDay: moment(),
    endDay: moment().add(7, "days"),
  });
  const [checkedCombo, setCheckedCombo] = useState(false)
  const [form] = Form.useForm();

  useEffect(() => {
    if(packageTicket){
      let {codePackage,comboTicketPrice,dateApply,dateExpire,
      namePackage,singleTicketPrice,status,id} = packageTicket
      form.setFieldsValue({
        codePackage,
        namePackage,
        singleTicket : singleTicketPrice,
        isSingleTicket : true,
        isComboTicket : comboTicketPrice ? true : false,
        comboTicket: comboTicketPrice,
        tinhTrang : status
      })
      setCheckedCombo(comboTicketPrice ? true : false)
      let temp1 = dateApply as any
      let temp2 = dateExpire as any

      setTime({
        startDay: moment(temp1.toDate()),
        endDay: moment(temp2.toDate()),
      })
    }
  }, [packageTicket])
  

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
  // Disable timepicker
  const disableTime = ()=>{
    if(time.startDay.isSame(time.endDay,'day')){
      let hour = time.startDay.get('hours')
      let minutes = time.startDay.get('minutes')
      let seconds = time.startDay.get('seconds')
      return {
        disabledHours: () => Array.from(Array(hour).keys()),
        disabledMinutes: (selectedHour: number) => {
          if(selectedHour === hour){
            return Array.from(Array(minutes).keys())
          }else{
            return []
          }
        },
        disabledSeconds: (selectedHour: number, selectedMinute: number) => {
          if(selectedHour === hour && selectedMinute === minutes){
            return Array.from(Array(seconds).keys())
          }else{
            return []
          }
        },
      };
    }
    return {
      disabledHours: () => [],
      disabledMinutes: (selectedHour: number) => [],
      disabledSeconds: (selectedHour: number, selectedMinute: number) => [],
    };
  }
  const onFinish = async(values: any) => {
    let {comboTicket,isComboTicket,isSingleTicket,namePackage,singleTicket,tinhTrang} = values
    let {price , amount } = comboTicket
    let newPackage :IPackageTicket = {
      codePackage : `ALT${moment().format('YYMMDDHHmmss')}`,
      dateApply : time.startDay.toDate(),
      dateExpire : time.endDay.toDate(),
      namePackage,
      singleTicketPrice : Number.parseInt(singleTicket),
      status : tinhTrang,
      comboTicketPrice: null,
      id: packageTicket?.id
    } 
    if(isComboTicket){
      newPackage.comboTicketPrice = {
        amount : Number.parseInt(amount),
        price : Number.parseInt(price)
      }
    }
    
    await PackageTicketService.updatePackageTicket(newPackage)
    Swal.fire({
      title: 'Th??nh c??ng!',
      text: 'C???p nh???t g??i v?? th??nh c??ng!',
      icon: 'success',
      confirmButtonText: 'Ok'
    }).then(()=>{
      form.resetFields()
      reset()
     handlePopup(false)
    })
  };

  const handleCloseModal = ()=>{
    handlePopup(false)
   }

  const handleChangeCombo = (value : any)=>{
    setCheckedCombo(value.target.checked)
  }
  return (
    <Modal
        centered
        visible={isOpen}
        className='bg-white add-ticket min-w-[758px] rounded-xl'
        closable={false}
        footer={null}
        onCancel={()=>{handlePopup(false)}}
        getContainer={false}
      >
      <h2 className="text-center font-bold text-2xl mb-[27px]">C???p nh???t g??i v??</h2>
      <Form name="nest-messages" onFinish={onFinish} form={form}>
      <Row className="gap-x-[82px]">
          <Col span={8}>
            <h2 className="flex items-center font-semibold text-base mb-[9px]">M?? g??i v??<span className="ml-1 text-primary-red">*</span></h2>
            <Form.Item name="codePackage" className="mb-[20px]"
        rules={[
          {
            required: true,
            message : 'Vui l??ng nh???p m?? g??i'
          }
        ]}
        
        >
          <Input disabled className=" w-full py-[10px] pr-4 text-base rounded-lg focus:border-yellow/1 focus:outline-none" placeholder="Nh???p m?? g??i v??"/>
        </Form.Item>
          </Col>
          <Col span={13}>
            <h2 className="flex items-center font-semibold text-base mb-[9px]">T??n g??i v??</h2>
            <Form.Item name="namePackage" className="mb-[20px]"
        rules={[
          {
            required: true,
            message : 'Vui l??ng nh???p t??n g??i'
          }
        ]}
        >
          <Input className=" w-full py-[10px] pr-4 text-base rounded-lg focus:border-yellow/1 focus:outline-none" placeholder="Nh???p t??n g??i v??"/>
        </Form.Item>
          </Col>
        </Row>
        {/* Date picker, Time picker */}
        <div className="w-full flex items-center mb-6">
          <div className="flex flex-col  gap-y-[5px] w-1/2 text-base font-semibold">
            <h2 className="font-semibold text-base">Ng??y ??p d???ng</h2>
            <div className="flex items-center gap-x-[9px]">
            <DatePicker
              name="day"
              onChange={handleStartDateChange}
              className="rounded-lg w-[150px] h-11 text-primary-gray-400"
              format={"DD/MM/YYYY"}
              value={time.startDay}
            />
            <TimePicker className="rounded-lg w-[150px] h-11 text-primary-gray-400" value={time.startDay}/>
            </div>
          </div>
          <div className="flex flex-col  gap-y-[5px] w-1/2 text-base font-semibold">
            <h2 className="font-semibold text-base">Ng??y h???t h???n</h2>
            <div className="flex items-center gap-x-[9px]">
            <DatePicker
              name="day"
              disabledDate={disabledDate}
              onChange={handleEndDateChange}
              className="rounded-lg w-[150px] h-11 text-primary-gray-400"
              format={"DD/MM/YYYY"}
              value={time.endDay}
            />
            <TimePicker
            disabledTime={disableTime}
            className="rounded-lg w-[150px] h-11 text-primary-gray-400" value={time.endDay}/>
            </div>
          </div>
        </div>
        <h2 className="font-semibold text-base mb-[13px]">Gi?? v?? ??p d???ng</h2>
        <div className="flex items-center without-margin-input gap-x-2 mb-[20px]">
          <Form.Item name="isSingleTicket" valuePropName="checked" rules={[{
            required: true,
            transform: value => (value || undefined),
            type: 'boolean',
            message: 'Vui l??ng ch???n ?? n??y!'
          }]}>
            <Checkbox className="rounded-[5px]"/>
          </Form.Item>
          <span className="text-base">V?? l??? (vn??/v??) v???i gi??</span>
          <Form.Item name="singleTicket"
            rules={[
              {
                required: true,
                message: 'Vui l??ng ??i???n v??o ?? n??y!'
              },
              {
                pattern: new RegExp(/^[1-9]+[0]{3,}/gm),
                message: 'S??? kh??ng ????ng ?????nh d???ng!'
              }
            ]}
          >
            <Input placeholder="Gi?? v??" className="rounded-lg bg-grey/2 outline-0 py-[10px] pl-3 max-w-[150px]"/>
          </Form.Item>
          <span className="text-base">/ v??</span>
        </div>
        <div className="flex items-center without-margin-input gap-x-2 mb-[24px]">
          <Form.Item name="isComboTicket" valuePropName="checked">
            <Checkbox className="rounded-[5px]" onChange={handleChangeCombo}/>
          </Form.Item>
          <span className="text-base">Combo v?? v???i gi??</span>
          <Form.Item name={['comboTicket','price']}
            rules={[
              {
                required: checkedCombo,
                message: 'Vui l??ng ??i???n v??o ?? n??y!'
              },
              {
                pattern: new RegExp(/^[1-9]+[0]{3,}/gm),
                message: 'S??? kh??ng ????ng ?????nh d???ng!'
              }
            ]}
          >
            <Input placeholder="Gi?? v??" className="rounded-lg bg-grey/2 outline-0 py-[10px] pl-3 max-w-[150px]"/>
          </Form.Item>
          <span className="text-base">/</span>
          <Form.Item name={['comboTicket','amount']}
            rules={[
              {
                required: checkedCombo,
                message: 'Vui l??ng ??i???n v??o ?? n??y!'
              },
              {
                pattern: new RegExp(/^[1-9]{1,2}$/gm),
                message: 'S??? kh??ng ????ng ?????nh d???ng!'
              }
            ]}
          >
            <Input placeholder="S??? v??" className="rounded-lg bg-grey/2 outline-0 py-[10px] pl-3 max-w-[72px]"/>
          </Form.Item>
          <span className="text-base">v??</span>
        </div>
        <h2 className="font-semibold text-base mb-[5px]">T??nh tr???ng</h2>
        <Form.Item name={['tinhTrang']}>
            <Select suffixIcon={<ChevronDownIcon className="h-5 w-5 text-yellow/1" />} className="rounded-lg max-w-[176px] h-11">
              <Option value='applying'>
                ??ang ??p d???ng
              </Option>
              <Option value='off' >
                T???t 
              </Option>
            </Select>
          </Form.Item>
        <span className="flex items-center text-base"><span className="ml-1 text-primary-red">*</span><span className="ml-1 text-[11px] italic opacity-40">l?? th??ng tin b???t bu???c</span></span>
        <Space  
        className="w-full items-center justify-center"
        >
           <Button
           onClick={handleCloseModal}
        className=" mt-[20px] btn w-[160px] h-[50px] hover:border-yellow/1 hover:text-yellow/1 font-bold text-lg"
        >   
            H???y
        </Button>
        <Button
        className="fill mt-[20px] btn w-[160px] h-[50px] hover:border-yellow/1 hover:text-white font-bold text-lg ml-6"
        htmlType="submit"
        >   
            L??u
        </Button>
        </Space>
      </Form>
    </Modal>
  );
};

export default UpdatePackage;
