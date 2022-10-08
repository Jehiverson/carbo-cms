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
interface DataProductsProps {
  id: string;
  title: string;
  subtitle: string;
  imgName: string;
  mvp: boolean;
  reverse: boolean;
  order: Number;
}[];

const TableProducts: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataProducts, setDataProducts] = useState<Array<DataProductsProps>>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [subTitle, setSubTitle] = useState<string | undefined>("");
  const [imgName, setImgName] = useState<string | undefined>("");

  const [imgFile, setImgFile] = useState<File | undefined>();
  const [mvp, setMvp] = useState<boolean | undefined | string>(true);
  const [reverse, setReverse] = useState<boolean | undefined | string>(true);
  const [imgFileName, setImgFileName] = useState<string>("");
  const [order, setOrder] = useState<number | undefined >(0);

  const getData = async () => {
    const getData = await fetch(`${host}products`)
      .then(response => response.json())
      .then(data => { return data.data });
    console.log(getData)
    if (dataProducts) {
      setLoading(false);
      setDataProducts(getData);
    }
  };

  const getUpdateData = async (id: string) => {
    
    const getDataId = await fetch(`${host}products/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro
    console.log(getDataId)
    if (getDataId) {
      setUid(getDataId.id);
      setTitle(getDataId.title);
      setSubTitle(getDataId.subtitle);
      setImgName(getDataId.imgName);
      setMvp(getDataId.mvp);
      setReverse(getDataId.reverse);
      setOrder(getDataId.order);
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
          "mvp": mvp,
          "reverse": reverse,
          "order": order
        };

        console.log(dataInsert)

         await fetch(`${host}products`,
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

  const updateData = async() =>{

    console.log(title)

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
        "mvp": mvp,
        "reverse": reverse,
        "order": order
      };

      await fetch(`${host}products`,
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
  };

  const deleteData =async(uid:string) => {
    await fetch(`${host}products`,
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
  };

  const cleanData = () => {
      setUid("");
      setTitle("");
      setSubTitle("");
      setImgName("");
      setImgFile(undefined);
      setImgName("");
      setMvp(true);
      setReverse(true);
      setImgFileName("");
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
    setImgFileName(fileList[0].name);
  };

  useEffect(() => {
    getData();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Productos</label>
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
            <Table.HeadCell>MVP</Table.HeadCell>
            <Table.HeadCell>Volteada</Table.HeadCell>
            <Table.HeadCell>Orden</Table.HeadCell>
            <Table.HeadCell>Opciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataProducts.length > 0?
              dataProducts.map((elementProducts, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementProducts.title}</Table.Cell>
                    <Table.Cell>{elementProducts.subtitle}</Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-25" src={elementProducts.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>{elementProducts.mvp?"True":"False"}</Table.Cell>
                    <Table.Cell>{elementProducts.reverse?"True":"False"}</Table.Cell>
                    <Table.Cell>{elementProducts.order.toString()}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateData(elementProducts.id)}><HiPencil /></Button>
                        <Button color="failure" onClick={() => deleteData(elementProducts.id)}><HiTrash /></Button>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                );
              }):
              (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell colSpan={6}> No se encontro información </Table.Cell>
                  </Table.Row>
              )
            }

          </Table.Body>
        </Table>
      )}

      <Modal show={openModal} onClose={() => {
        cleanData()
        setOpenModal(false)
        }}>
        <Modal.Header>Crear Registro</Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="email1"
                value="Title"
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
                value="MVP"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              onChange={(e) => {setMvp(e.target.value === "true"?true:false)}}
            >
              <option>
                True
              </option>
              <option>
                False
              </option>
            </Select>
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Reverse"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              onChange={(e) => {setReverse(e.target.value === "true"?true:false)}}
            >
              <option>
                True
              </option>
              <option>
                False
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
                value="Image"
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
          <Button onClick={() => insertData()}> Guardar </Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModalUpdate} onClose={() => {
          cleanData()
          setOpenModalUpdate(false)
        }}>
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
                value="MVP"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              value={mvp?.toString()}
              onChange={(e) => {setMvp(e.target.value === "true"?true:false)}}
            >
              <option>
                true
              </option>
              <option>
                false
              </option>
            </Select>
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
              value={reverse?.toString()}
              onChange={(e) => {setReverse(e.target.value === "true"?true:false)}}
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
            {
              imgFileName?.length > 0 && (
                <Alert color="info">
                  <span>
                    <span className="font-medium">
                      Archivo Cargado: 
                    </span>
                    {" " + imgFileName}
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

export default TableProducts;
