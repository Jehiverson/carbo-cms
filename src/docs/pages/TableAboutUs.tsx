import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput,Textarea } from '../../lib';
import {
  HiPencil,/* 
  HiPlus,
  HiTrash, */
} from 'react-icons/hi';
import Swal from 'sweetalert2'

import { host } from "../../constants/defaultSetting";

interface DataAboutUsProps {
  id: string;
  description: string;
  imgName: string;
}[];

const TableAboutUs: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataAboutUs, setDataAboutUs] = useState<Array<DataAboutUsProps>>([]);
  //const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");

  const getData = async () => {
    const getData = await fetch(`${host}aboutus`)
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataAboutUs) {
      setLoading(false);
      setDataAboutUs(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    const getDataId = await fetch(`${host}aboutus/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataId) {
      setUid(getDataId.id);
      setDescription(getDataId.description);
      setOpenModalUpdate(true);
    }
  };

  const updateData = async() =>{
    
    if(description?.length === 0){
      Swal.fire(
        "Error",
        "Campo de Descripción vacio",
        'error'
      );
      return;
    }

      let dataUpdate = {
        "id": uid,
        "description": description
      };

      console.log(dataUpdate)

      await fetch(`${host}aboutus`,
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
        "Éxito",
        'Tu registro fue actualizado',
        'success'
      );
  }

  const cleanData = () => {
      setUid("");
      setDescription("");
  };



  useEffect(() => {
    getData();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Sobre Nosotros</label>
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
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Opciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataAboutUs.length > 0?
              dataAboutUs.map((elementAboutUs, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementAboutUs.description}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementAboutUs.id)}><HiPencil /></Button>
                        {/* <Button color="failure" onClick={() => deleteData(elementAboutUs.id)}><HiTrash /></Button> */}
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
                value="Descripción"
              />
            </div>
            <Textarea
              id="title"
              rows={8}
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
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

export default TableAboutUs;
