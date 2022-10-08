import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, FileInput, Textarea, Alert } from '../../lib';
import {
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi';
import Swal from 'sweetalert2'

import { updateImage } from "../functions/generalFunctions";
import { host } from "../../constants/defaultSetting";

interface DataSendMethodsProps {
  id: string;
  title: string;
  description: string;
  imgName: string;
}[];

const TableSendMethods: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataSendMethods, setDataSendMethods] = useState<Array<DataSendMethodsProps>>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>("");
  const [imgName, setImgName] = useState<string | undefined>("");
  const [imgFile, setImgFile] = useState<File | undefined>();
  const [imgFileName, setImgFileName] = useState<string>("");
  
  const getData = async () => {
    const getData = await fetch(`${host}sendmethods`)
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataSendMethods) {
      setLoading(false);
      setDataSendMethods(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    setImgFileName("");
    const getDataId = await fetch(`${host}sendmethods/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataId) {
      setUid(getDataId.id);
      setTitle(getDataId.title);
      setDescription(getDataId.description);
      setImgName(getDataId.imgName);
      setOpenModalUpdate(true);
    }
  };

  const insertData = async () => {

    if(title?.length === 0){
      Swal.fire(
        "Error",
        "Campo de titulo vacio",  
        'error'
      );
      return;
    }

    if(description?.length === 0){
      Swal.fire(
        "Error",
        "Campo de descripción vacio",
        'error'
      );
      return;
    }

    
    if (imgFile) {
      var urlImage = await updateImage(imgFile);
      if (urlImage) {

        let dataInsert = {
          "title": title,
          "imgName": urlImage,
          "description": description
        };

        await fetch(`${host}sendmethods`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataInsert)
          })
          .then(response => response.json())
          .then(data => { return data.data });
          
          cleanData();
          getData();
          setOpenModal(false);

          Swal.fire(
            "Éxito",
            "Tu registro fue agregado",
            'success'
          );

      } else {
        Swal.fire(
          "Error",
          "Error, archivo vacio.",
          'error'
        );
      }

    }else{
      Swal.fire(
        "Error",
        "Error, al agregar archivo.",
        'error'
      );
    }

  };

  const updateData = async() =>{

    if(title?.length === 0){
      Swal.fire(
        "Error",
        "Campo de titulo vacio",
        'error'
      );
      return;
    }

    if(description?.length === 0){
      Swal.fire(
        "Error",
        "Campo de descripción vacio",
        'error'
      );
      return;
    }
    
    let urlImage;
    if(imgFile){
      urlImage = await updateImage(imgFile); 
    }else{
      urlImage = imgName;
    }
    
      let dataUpdate = {
        "id": uid,
        "title": title,
        "imgName": urlImage,
        "description": description
      };

      console.log(dataUpdate)

      await fetch(`${host}sendmethods`,
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

  const deleteData =async(uid:string) => {
    await fetch(`${host}sendmethods`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: uid})
      })
      .then(response => response.json())
      .then(data => { return data.data });
    
      setLoading(true);
  }

  const cleanData = () => {
      setUid("");
      setTitle("");
      setDescription("");
      setImgName("");
      setImgFile(undefined);
      setImgName("");
      setImgFileName("");
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
    setImgFileName(fileList[0].name)
  };

  useEffect(() => {
    getData();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Metodos De Envio</label>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <Button onClick={() => {
              cleanData()
              setOpenModal(true)
              }
            }>
            Agregar
            <HiPlus className="ml-2 h-5 w-5" />
          </Button>
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
            <Table.HeadCell>Titulo</Table.HeadCell>
            <Table.HeadCell>Descripción</Table.HeadCell>
            <Table.HeadCell>Imagen</Table.HeadCell>
            <Table.HeadCell>Opciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataSendMethods.length > 0?
              dataSendMethods.map((elementSendMethods, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementSendMethods.title}</Table.Cell>
                    <Table.Cell>{elementSendMethods.description}</Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-30" src={elementSendMethods.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementSendMethods.id)}><HiPencil /></Button>
                        <Button color="failure" onClick={() => deleteData(elementSendMethods.id)}><HiTrash /></Button>
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

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Crear Registro</Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="email1"
                value="Titulo"
              />
            </div>
            <TextInput
              id="email1"
              type="text"
              value={title}
              required={true}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password1"
                value="Descripción"
              />
            </div>
            <Textarea
              id="password1"
              rows={7}
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div id="fileUpload">
            <div className="mb-2 block">
              <Label
                htmlFor="file"
                value="Imagen"
              />
            </div>
            <FileInput
              id="file"
              helperText="Imagen que se mostrara dentro de la plantilla"
              onChange={handleImageChange}
              value={""}
              />
              <br />
              {
                imgFileName?.length > 0 && (
                  <Alert color="info">
                    <span>
                    <span className="font-medium">
                      Archivo Cargado: 
                    </span>
                      {" "+imgFileName}
                    </span>
                  </Alert>
                )
              }
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => insertData()}>Guardar</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

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
                value="Titulo"
              />
            </div>
            <TextInput
              id="title"
              type="text"
              value={title}
              required={true}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="subtitle"
                value="Descripción"
              />
            </div>
            <Textarea
              id="subtitle"
              rows={7}
              value={description}
              required={true}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div id="fileUpload">
            <div className="mb-2 block">
              <Label
                htmlFor="file"
                value="Imagen"
              />
            </div>
            <FileInput
              id="file"
              helperText="Seleccione imagen"
              onChange={handleImageChange}
              value={""}
              />
              {
                imgFileName?.length > 0 && (
                  <Alert color="info">
                    <span>
                    <span className="font-medium">
                      Archivo Cargado: 
                    </span>
                      {" "+imgFileName}
                    </span>
                  </Alert>
                )
              }
              <br />
          </div>
          <img className="w-50 h-20" src={imgName} alt="Logo" />
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

export default TableSendMethods;
