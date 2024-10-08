import NavCM from "../cmPage/navCM/NavCM";
import GetBannersCM from "../cmPage/getBanners/GetBannersCM";

function CMPage() {
  return (
    <>
      <NavCM />
      <div>
        <GetBannersCM />
      </div>
    </>
  );
}
export default CMPage;
