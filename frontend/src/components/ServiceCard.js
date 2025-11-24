const ServiceCard = ({ title, description, image }) => {
  return (
    <div className="service-card">
      {image && (
        <div className="service-image-wrap">
          <img src={image} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ServiceCard;
