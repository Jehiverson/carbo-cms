import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, Textarea } from '../../lib';
import {
  HiPencil,/* 
  HiPlus,
  HiTrash, */
} from 'react-icons/hi';
import Swal from 'sweetalert2';

import { host } from "../../constants/defaultSetting";
interface DataContactUsProps {
  id: string;
  phone1: string;
  phone2: string;
  address: string;
  email: string;
  schedule: string;
}[];

const TableContactUs: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataContactUs, setDataContactUs] = useState<Array<DataContactUsProps>>([]);
  //const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [phone1, setPhone1] = useState<string | undefined>("");
  const [phone2, setPhone2] = useState<string | undefined>("");
  const [address, setAddress] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [schedule, setSchedule] = useState<string | undefined>("");

  const getData = async () => {
    const getData = await fetch(`${host}contactus`)
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataContactUs) {
      setLoading(false);
      setDataContactUs(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    console.log(1)
    const getDataId = await fetch(`${host}contactus/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataId) {
      setUid(getDataId.id);
      setPhone1(getDataId.phone1);
      setPhone2(getDataId.phone2);
      setAddress(getDataId.address);
      setEmail(getDataId.email);
      setSchedule(getDataId.schedule);
      setOpenModalUpdate(true);
    }
  };

  const updateData = async() =>{

      let dataUpdate = {
        "id": uid,
        "phone1": phone1,
        "phone2": phone2,
        "address": address,
        "email": email,
        "schedule": schedule
      };

      await fetch(`${host}contactus`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUpdate)
      })
      .then(response => response.json())
      .then(data => { return data.data });

      cleanData();
      setLoading(true);
      setOpenModalUpdate(false);
      Swal.fire(
        'Success',
        'Your Register was update',
        'success'
      );
  }

  const cleanData = () => {
      setUid("");
      setPhone1("");
      setPhone2("");
      setAddress("");
      setEmail("");
      setSchedule("");
  };

  useEffect(() => {
    getData();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Contactanos</label>
        </div>
      </div>
      <br />
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Teléfono 1</Table.HeadCell>
            <Table.HeadCell>Teléfono 2</Table.HeadCell>
            <Table.HeadCell>Dirección</Table.HeadCell>
            <Table.HeadCell>Correo</Table.HeadCell>
            <Table.HeadCell>Horarios</Table.HeadCell>
            <Table.HeadCell>Opciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataContactUs.length > 0?
              dataContactUs.map((elementContactUs, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementContactUs.phone1}</Table.Cell>
                    <Table.Cell>{elementContactUs.phone2}</Table.Cell>
                    <Table.Cell>{elementContactUs.address}</Table.Cell>
                    <Table.Cell>{elementContactUs.email}</Table.Cell>
                    <Table.Cell>{elementContactUs.schedule}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementContactUs.id)}><HiPencil /></Button>
                        {/* <Button color="failure" onClick={() => deleteData(elementContactUs.id)}><HiTrash /></Button> */}
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                );
              }):
              (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={4}> No se encontro información </Table.Cell>
                  </Table.Row>
              )
            }

          </Table.Body>
        </Table>
      )}

      <Modal show={openModalUpdate} onClose={() => setOpenModalUpdate(false)}>
        <Modal.Header>Actualizar Registro</Modal.Header>
        <Modal.Body>
          <div>
            <TextInput
              type="hidden"
              value={uid}
              required={true}
              readOnly
            />
              <div className="mb-2 block">
                <Label
                  htmlFor="title"
                  value="Teléfono 1"
                />
              </div>
              <TextInput
                id="title"
                type="text"
                value={phone1}
                required={true}
                onChange={(e) => setPhone1(e.target.value)}
              />
              <div className="mb-2 block">
                <Label
                  htmlFor="description"
                  value="Teléfono 2"
                />
              </div>
              <TextInput
                id="description"
                type="text"
                value={phone2}
                required={true}
                onChange={(e) => setPhone2(e.target.value)}
              />
              <div className="mb-2 block">
                <Label
                  htmlFor="description"
                  value="Dirección"
                />
              </div>
              <Textarea
                id="Address"
                rows={4}
                value={address}
                required={true}
                onChange={(e) => setAddress(e.target.value)}
              />
              <div className="mb-2 block">
                <Label
                  htmlFor="description"
                  value="Correo"
                />
              </div>
              <TextInput
                id="Email"
                type="text"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="mb-2 block">
                <Label
                  htmlFor="description"
                  value="Horario"
                />
              </div>
              <TextInput
                id="schedule"
                type="text"
                value={schedule}
                required={true}
                onChange={(e) => setSchedule(e.target.value)}
              />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateData()}>Actualizar</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableContactUs;
