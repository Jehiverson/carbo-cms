import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, FileInput, Select, Textarea, Alert } from '../../lib';
import {
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi';
import Swal from 'sweetalert2'

import { updateImage } from "../functions/generalFunctions";
import { host } from "../../constants/defaultSetting";
interface DataOurMissionProps {
  id: string;
  title: string;
  subtitle: string;
  imgName: string;
  type: boolean;
  order: Number;
}[];

const TableOurMission: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataOurMission, setDataOurMission] = useState<Array<DataOurMissionProps>>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [subTitle, setSubTitle] = useState<string | undefined>("");
  const [imgName, setImgName] = useState<string | undefined>("");

  const [imgFile, setImgFile] = useState<File | undefined>();
  const [type, setType] = useState<boolean | undefined | string>(true);
  const [imgFileName, setImgFileName] = useState<string>("");
  const [order, setOrder] = useState<number | undefined >(0);

  const getDataOurMission = async () => {
    const getDataOurMission = await fetch(`${host}ourmission`)
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getDataOurMission)
    if (dataOurMission) {
      setLoading(false);
      setDataOurMission(getDataOurMission);
    }
  };

  const getUpdateDataOurMission = async (id: string) => {
    setImgFileName("");
    const getDataIdOurMission = await fetch(`${host}ourmission/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro
    console.log(getDataIdOurMission);
    if (getDataIdOurMission) {
      setUid(getDataIdOurMission.id);
      setTitle(getDataIdOurMission.title);
      setSubTitle(getDataIdOurMission.subtitle);
      setImgName(getDataIdOurMission.imgName);
      setType(getDataIdOurMission.type);
      setOrder(getDataIdOurMission.order);
      setOpenModalUpdate(true);
    }
  };

  const insertDataOurMission = async () => {

    if(title?.length === 0){
      Swal.fire(
        "Error",
        "Campo de titulo vacio",
        'error'
      );
      return;
    }

    if(subTitle?.length === 0){
      Swal.fire(
        "Error",
        "Campo de subtitulo vacio",
        'error'
      );
      return;
    }

    if(order?.toString().length === 0){
      Swal.fire(
        "Error",
        "Campo de orden vacio",
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
          "subtitle": subTitle,
          "type": type,
          "order": order
        };

        await fetch(`${host}ourmission`,
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
          getDataOurMission();
          setOpenModal(false);

          Swal.fire(
            "Éxito",
            "Tu registro fue agregado",
            'success'
          );

      } else {
        Swal.fire(
          "Error",
          "Error, al agregar archivo.",
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

  const updateDataOurMission = async() =>{

    if(title?.length === 0){
      Swal.fire(
        "Error",
        "Campo de titulo vacio",
        'error'
      );
      return;
    }

    if(subTitle?.length === 0){
      Swal.fire(
        "Error",
        "Campo de subtitulo vacio",
        'error'
      );
      return;
    }

    if(order?.toString().length === 0){
      Swal.fire(
        "Error",
        "Campo de orden vacio",
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
        "subtitle": subTitle,
        "type": type,
        "order": order
      };

      await fetch(`${host}ourmission`,
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

  const deleteDataOurMission =async(uid:string) => {
    await fetch(`${host}ourmission`,
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
      setSubTitle("");
      setImgName("");
      setImgFile(undefined);
      setImgName("");
      setType(true);
      setImgFileName("");
      setOrder(0);
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
    setImgFileName(fileList[0].name);
  };

  useEffect(() => {
    getDataOurMission();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Nuestra Misión</label>
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
            <Table.HeadCell>Subtitulo</Table.HeadCell>
            <Table.HeadCell>Imagen</Table.HeadCell>
            <Table.HeadCell>Voltear</Table.HeadCell>
            <Table.HeadCell>Orden</Table.HeadCell>
            <Table.HeadCell>Opciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataOurMission.length > 0?
              dataOurMission.map((elementOurMission, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementOurMission.title}</Table.Cell>
                    <Table.Cell>{elementOurMission.subtitle}</Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-30" src={elementOurMission.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>{elementOurMission.type?"True":"False"}</Table.Cell>
                    <Table.Cell>{elementOurMission.order.toString()}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateDataOurMission(elementOurMission.id)}><HiPencil /></Button>
                        <Button color="failure" onClick={() => deleteDataOurMission(elementOurMission.id)}><HiTrash /></Button>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                );
              }):
              (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={5}> No se encontro información </Table.Cell>
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
                value="Titutulo"
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
                value="Subtitulo"
              />
            </div>
            <Textarea
              id="password1"
              rows={4}
              value={subTitle}
              required={true}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Voltear"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              value={type?.toString()}
              onChange={(e) => {setType(e.target.value === "true"?true:false)}}
            >
              <option>
                true
              </option>
              <option>
                false
              </option>
            </Select>
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="orden"
                value="Orden"
              />
            </div>
            <TextInput
              id="orden"
              type="number"
              value={order}
              required={true}
              onChange={(e) => setOrder(Number(e.target.value))}
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
          <Button onClick={() => insertDataOurMission()}>Guardar</Button>
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
                value="Subtitulo"
              />
            </div>
            <Textarea
              id="subtitle"
              rows={4}
              value={subTitle}
              required={true}
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Voltear"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              value={type?.toString()}
              onChange={(e) => {setType(e.target.value === "true"?true:false)}}
            >
              <option>
                true
              </option>
              <option>
                false
              </option>
            </Select>
          </div>

          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="orden"
                value="Orden"
              />
            </div>
            <TextInput
              id="orden"
              type="number"
              value={order}
              required={true}
              onChange={(e) => setOrder(Number(e.target.value))}
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
            <br />
          </div>
          <img className="w-50 h-20" src={imgName} alt="Logo" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateDataOurMission()}>Actualizar</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableOurMission;
