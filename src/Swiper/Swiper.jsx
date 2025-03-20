export default function MySwiper({ setLoading, setError }) {
  const { po } = useParams();
  const [produits, setProduits] = useState([]);

  useEffect(() => {
    const fetchProduitsByPosition = async () => {
      setLoading(true);
      try {
        const produitResponse = await api.get(`/produits/${po}`);
        const produit = produitResponse.data;
        const positionId = produit.position_id;

        const relatedProduitsResponse = await api.get(
          `/produits/position/${positionId}`
        );
        setProduits(relatedProduitsResponse.data);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProduitsByPosition();
  }, [po, setLoading, setError]);

  if (!produits.length) {
    return null; // Ne rien afficher si aucun produit n'est disponible
  }

  return (
    <SwiperContainer>
      <Swiper
        slidesPerView={"auto"}
        centeredSlides={true}
        spaceBetween={20}
        grabCursor={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {produits.map((produit) => (
          <SwiperSlide key={produit.po}>
            <Card>
              <ImageContainer>
                <img src={produit.image} alt={produit.style} />
              </ImageContainer>
              <h3>{produit.style}</h3>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </SwiperContainer>
  );
}