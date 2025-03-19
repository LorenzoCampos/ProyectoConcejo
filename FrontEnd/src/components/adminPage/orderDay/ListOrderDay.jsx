function ListOrderDay() {

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(API.GET_PDF, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        responseType: "blob", // Importante para manejar archivos binarios
      });
  
      // Crear una URL para el archivo PDF
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
  
      // Abrir el PDF en una nueva pestaña
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
    }
  };
  return (
    <div className="page-form">
      <h1>Ordenes del día</h1>
      <h2>Filtro</h2>
    </div>
  );
}

export default ListOrderDay;