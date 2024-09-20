import styles from './Loading.module.scss';

const Loading = () => (
  <svg
    fill="none"
    height="60"
    viewBox="0 0 100 60" width="100"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.loading}
  >
    <path d="m78.4351 32.9649c2.0322-12.1028-5.2462-20.5937-15.1954-23.86728-3.1065-3.086-5.628-8.135479-9.6203-9.0098662-3.919-.8586998-1.4222 4.7980562-2.7953 7.6519162-.1428.01359-.2898.00342-.4278.04069-10.2146 2.72444-16.9677 8.83394-20.1667 17.51504-1.3157 2.7186-1.518 4.0278-3.1921 5.8712-3.0247 3.3345-5.5386 7.0806-6.4148 9.9274 5.1433.1823 9.1187-2.3634 9.1187-2.3634 2.3924 2.5212 6.6853 3.8939 7.2482 3.6372 1.6344-4.5837-5.1283-8.2742 1.9702-15.2356 3.1873-1.7628 4.9891-2.982 8.8389-3.3922 2.0399-.2174 6.5651-.1513 6.1412.4825-.475.7102-.9912 1.4264-1.5077 2.1264-2.7692 3.7499-5.5773 7.0429-2.1611 6.6789 5.8572-.6241 10.3026-2.134 12.9699-3.5558.2793.2072.5615.4198.8484.6377.8052.6108 1.6314 1.2509 2.4876 1.9159 2.1228 1.6484 5.4717 2.9919 6.5564 5.4912 3.125 7.1952 7.3036 5.0349 5.9987 1.9892-1.3027-3.0458-1.3843-2.4348-.697-6.5411z" fill="#0060c2" className={styles.dolphin} />
    <g className={styles.wave}>
      <path d="m83.3251 56.638c2.9223-.0095 4.5434-.5199 6.0573-1.1847.4896-.2144.975-.4598 1.4829-.7165 1.056-.5339 2.209-1.1168 3.6981-1.5712 1.4622-.4457 3.2122-.7309 5.4366-.7293 3.329-.0094 5.614.6616 7.42 1.4747.623.2807 1.181.5612 1.714.8293 1.021.5127 1.95.9797 3.066 1.3148 1.141.3418 2.515.5828 4.459.5828 2.92-.0095 4.54-.5199 6.054-1.1847.486-.2135.969-.4578 1.473-.7133 1.057-.5348 2.211-1.1191 3.701-1.5743 1.464-.4457 3.212-.7308 5.434-.7293v7.5637h-133.321v-7.5635c3.32873-.0094 5.6139.6615 7.41997 1.4746.62284.2807 1.18106.5612 1.71443.8293 1.0201.5127 1.9493.9797 3.0661 1.3148 1.1404.3418 2.5142.5828 4.4582.5828 2.9199-.0095 4.5401-.5199 6.0541-1.1847.4862-.2135.9688-.4578 1.4737-.7133 1.0565-.5348 2.2109-1.1191 3.7006-1.5742 1.4642-.4458 3.2121-.7309 5.4334-.7293 3.3285-.0094 5.6176.6615 7.4229 1.4746.6238.2809 1.1825.5616 1.7164.8299 1.0198.5124 1.9488.9792 3.0672 1.3142 1.142.3418 2.518.5828 4.4614.5828 2.9205-.0095 4.5408-.5199 6.0539-1.1847.4862-.2135.9689-.4578 1.4739-.7133 1.0567-.5348 2.2112-1.1191 3.7004-1.5742 1.4642-.4458 3.2129-.7309 5.4334-.7293 3.3318-.0094 5.6194.6615 7.4262 1.4746.624.2808 1.1829.5615 1.7169.8297 1.0205.5125 1.9501.9794 3.0691 1.3144 1.1422.3418 2.5174.5828 4.4629.5828z" fill="#fff" />
      <path d="m83.3251 56.638c2.9223-.0095 4.5434-.5199 6.0573-1.1847.4896-.2144.975-.4598 1.4829-.7165 1.056-.5339 2.209-1.1168 3.6981-1.5712 1.4622-.4457 3.2122-.7309 5.4366-.7293 3.329-.0094 5.614.6616 7.42 1.4747.623.2807 1.181.5612 1.714.8293 1.021.5127 1.95.9797 3.066 1.3148 1.141.3418 2.515.5828 4.459.5828 2.92-.0095 4.54-.5199 6.054-1.1847.486-.2135.969-.4578 1.473-.7133 1.057-.5348 2.211-1.1191 3.701-1.5743 1.464-.4457 3.212-.7308 5.434-.7293l-.001 3.3618c-2.918.0094-4.537.5199-6.052 1.1848-.491.2147-.978.4613-1.488.7195-1.053.5333-2.204 1.1161-3.688 1.5693-1.461.4428-3.211.7311-5.434.728-3.326.0109-5.614-.6602-7.418-1.4746-.62-.2798-1.177-.5593-1.708-.8264-1.022-.5136-1.952-.9813-3.074-1.316-1.139-.345-2.515-.5829-4.458-.5844-2.9239.0094-4.5432.5198-6.0586 1.1847-.4904.2146-.9767.4607-1.4855.7181-1.0553.5339-2.2074 1.1169-3.6944 1.5707-1.4635.4428-3.2137.7311-5.4366.728-3.3287.0109-5.6176-.6602-7.4229-1.4731-.6213-.2799-1.1786-.5599-1.7111-.8274-1.0231-.514-1.955-.9821-3.0749-1.3167-1.1437-.345-2.5191-.5828-4.4662-.5844-2.9184.0094-4.5369.5199-6.0518 1.1848-.4912.2148-.9784.4615-1.4885.7198-1.0531.5333-2.2036 1.1159-3.6873 1.569-1.4609.4428-3.2113.7311-5.434.728-3.3287.0109-5.6155-.6602-7.4215-1.4731-.6194-.2795-1.1747-.5586-1.7052-.8253-1.0247-.515-1.957-.9836-3.08-1.3188-1.1407-.345-2.5159-.5828-4.4614-.5844-2.9184.0094-4.5369.5199-6.0526 1.1848-.4909.2147-.9779.4614-1.4877.7196-1.0531.5333-2.2036 1.116-3.6881 1.5692-1.4609.4428-3.2103.7311-5.4332.728-3.327.0109-5.6145-.6602-7.41841-1.4746-.62061-.2798-1.1768-.5593-1.70826-.8265-1.02184-.5136-1.95229-.9812-3.0736-1.3159-1.13907-.345-2.51505-.5829-4.45823-.5844v-3.3619c3.32873-.0094 5.6139.6615 7.41997 1.4746.62284.2807 1.18106.5612 1.71443.8293 1.0201.5127 1.9493.9797 3.0661 1.3148 1.1404.3418 2.5142.5828 4.4582.5828 2.9199-.0095 4.5401-.5199 6.0541-1.1847.4862-.2135.9688-.4578 1.4737-.7133 1.0565-.5348 2.2109-1.1191 3.7006-1.5742 1.4642-.4458 3.2121-.7309 5.4334-.7293 3.3285-.0094 5.6176.6615 7.4229 1.4746.6238.2809 1.1825.5616 1.7164.8299 1.0198.5124 1.9488.9792 3.0672 1.3142 1.142.3418 2.518.5828 4.4614.5828 2.9205-.0095 4.5408-.5199 6.0539-1.1847.4862-.2135.9689-.4578 1.4739-.7133 1.0567-.5348 2.2112-1.1191 3.7004-1.5742 1.4642-.4458 3.2129-.7309 5.4334-.7293 3.3318-.0094 5.6194.6615 7.4262 1.4746.624.2808 1.1829.5615 1.7169.8297 1.0205.5125 1.9501.9794 3.0691 1.3144 1.1422.3418 2.5174.5828 4.4629.5828z" fill="#00366b" />
    </g>
  </svg>
);

export default Loading;
