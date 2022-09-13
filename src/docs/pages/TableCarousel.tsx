import type { FC } from 'react';
import { useState, useEffect } from 'react';
import { Modal, Table, Button, Spinner, Label, TextInput, FileInput, Select, Textarea } from '../../lib';
import {
  HiPencil,
  HiPlus,
  HiTrash,
} from 'react-icons/hi';
import Swal from 'sweetalert2'

import { updateImage } from "../functions/generalFunctions";
import { host } from "../../constants/defaultSetting";

interface DataCarouselProps {
  id: string;
  title: string;
  subtitle: string;
  imgName: string;
  pageUsed: string;
}[];

const TableCarousel: FC = () => {

  const [loading, setLoading] = useState<boolean | undefined>(true);
  const [dataCarousel, setDataCarousel] = useState<Array<DataCarouselProps>>([]);
  const [openModal, setOpenModal] = useState<boolean | undefined>();
  const [openModalUpdate, setOpenModalUpdate] = useState<boolean | undefined>();

  const [uid, setUid] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const [subTitle, setSubTitle] = useState<string | undefined>("");
  const [imgName, setImgName] = useState<string | undefined>("");

  const [imgFile, setImgFile] = useState<File | undefined>();
  const [pageUsed, setPageUsed] = useState<string | undefined>("");

  const getDataCarousel = async () => {
    const getDataCarousel = await fetch(`${host}carousel`)
      .then(response => response.json())
      .then(data => { return data.data });

    if (dataCarousel) {
      setLoading(false);
      setDataCarousel(getDataCarousel);
    }
  };

  const getUpdateDataCarousel = async (id: string) => {
    const getDataIdCarousel = await fetch(`${host}carousel/${id}`)
      .then(response => response.json())
      .then(data => { return data.data });
    //Validar cuando sea false mostrar una modal de errro

    if (getDataIdCarousel) {
      setUid(getDataIdCarousel.id);
      setTitle(getDataIdCarousel.title);
      setSubTitle(getDataIdCarousel.subtitle);
      setImgName(getDataIdCarousel.imgName);
      setPageUsed(getDataIdCarousel.pageUsed);
      setOpenModalUpdate(true);
    }
  };

  const insertDataCarousel = async () => {

    if (imgFile) {
      var urlImage = await updateImage(imgFile);
      if (urlImage) {

        let dataInsert = {
          "title": title,
          "imgName": urlImage,
          "subtitle": subTitle,
          "pageUsed": pageUsed
        };

        await fetch(`${host}carousel`,
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
          getDataCarousel();
          setOpenModal(false);

          Swal.fire(
            'Success',
            'Your Register was add',
            'success'
          );

      } else {
        //Validar cuando el archivo este vacios
      }

    }

  };

  const updateDataCarousel = async() =>{
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
        "pageUsed": pageUsed
      };

      console.log(dataUpdate)

      await fetch(`${host}carousel`,
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

  const deleteDataCarousel =async(uid:string) => {
    await fetch(`${host}carousel`,
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
      setPageUsed("");
  };

  const handleImageChange = function (e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList) return;
    setImgFile(fileList[0]);
  };

  useEffect(() => {
    getDataCarousel();
  }, [loading]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <label style={{ color: 'white', fontSize: '30px' }}>Carousel (Inicio, Sobre nosotros, Sobre la compañia)</label>
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
            <Table.HeadCell>Página de uso</Table.HeadCell>
            <Table.HeadCell>Opciones</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">

            {
              dataCarousel.length > 0?
              dataCarousel.map((elementCarousel, idElement) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={idElement}>
                    <Table.Cell>{elementCarousel.title}</Table.Cell>
                    <Table.Cell>{elementCarousel.subtitle}</Table.Cell>
                    <Table.Cell>
                      <img className="w-40 h-30" src={elementCarousel.imgName} alt="Logo" />
                    </Table.Cell>
                    <Table.Cell>{elementCarousel.pageUsed}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button onClick={() => getUpdateDataCarousel(elementCarousel.id)}><HiPencil /></Button>
                        <Button color="failure" onClick={() => deleteDataCarousel(elementCarousel.id)}><HiTrash /></Button>
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
                value="Subtitulo"
              />
            </div>
            <Textarea
              id="password1"
              value={subTitle}
              required={true}
              onChange={(e) => setSubTitle(e.target.value)}
              rows={4}
            />
          </div>

          <div id="select">
            <div className="mb-2 block">
              <Label
                htmlFor="page-img"
                value="Selecionar una imagen"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              onChange={(e) => {setPageUsed(e.target.value)}}
            >
              <option>
                Inicio
              </option>
              <option>
                Sobre Nosotros
              </option>
              <option>
                Sobre La Compañia
              </option>
            </Select>
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
            />
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => insertDataCarousel()}>Guardar</Button>
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
                value="Selecionar una imagen"
              />
            </div>
            <Select
              id="page-img"
              required={true}
              value={pageUsed}
              onChange={(e) => {setPageUsed(e.target.value)}}
            >
              <option>
                Inicio
              </option>
              <option>
                Sobre Nosotros
              </option>
              <option>
                Sobre La Compañia
              </option>
            </Select>
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
              helperText="Seleccione imagen"
              onChange={handleImageChange}
            />
          </div>
          <img className="w-80 h-30" src={imgName} alt="Logo" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => updateDataCarousel()}>Actualizar</Button>
          <Button color="gray" onClick={() => setOpenModalUpdate(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TableCarousel;
