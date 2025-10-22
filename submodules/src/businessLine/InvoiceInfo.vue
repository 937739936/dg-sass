<template>
	<div class="goods-info">
		<a-tabs
			v-model="tab"
			@change="changeTab"
		>
			<a-tab-pane
				key="income"
				:tab="incomeLabel"
				v-if="isShowIncome"
			>
			</a-tab-pane>
			<a-tab-pane
				key="freight"
				:tab="freightLabel"
				v-if="isShowFreight"
			>
			</a-tab-pane>
			<div slot="tabBarExtraContent">
				<div
					class="btn-box-title"
					v-if="contractType == 'trans' && isRoleAuth && !isBank && type == 'rest'"
					@click="goAddInvoice('DELIVER')"
				>
					新增发票
				</div>
				<a-tooltip
					placement="bottomRight"
					trigger="hover"
					overlayClassName="add-invoice-tooltips"
					v-if="contractType != 'trans' && isRoleAuth && !isBank && type == 'rest'"
				>
					<template slot="title">
						<div class="btn-box-menu">
							<div class="btn-box-menu-item">
								<div style="display: flex; align-items: center">
									<!-- <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M40 13.8973C40 13.8476 39.9975 13.7979 39.9925 13.7484V7.02305L39.9902 7.0207V6.98711C39.9902 6.72652 39.9387 6.46848 39.8386 6.22772C39.7385 5.98697 39.5918 5.76821 39.4069 5.58394C39.2219 5.39968 39.0024 5.25351 38.7608 5.15379C38.5191 5.05406 38.2602 5.00273 37.9986 5.00273H37.9896L37.9873 5H2.02603L2.01897 5.00664H1.99663C1.47027 5.00663 0.965314 5.21425 0.592132 5.58412C0.21895 5.95398 0.00789466 6.45601 0.00509708 6.98047V13.7719C0.00196082 13.8109 6.52257e-07 13.85 6.52257e-07 13.8891C-0.000331262 14.2397 0.126023 14.5787 0.355951 14.8441C0.585878 15.1095 0.904011 15.2835 1.25216 15.3344C2.27455 15.6188 3.17539 16.2289 3.8171 17.0715C4.45881 17.914 4.8061 18.9427 4.80594 20.0004C4.80606 21.0676 4.45262 22.105 3.80046 22.9516C3.14831 23.7982 2.23392 24.4066 1.19923 24.6824C1.13886 24.6984 1.0777 24.7133 1.01654 24.727C0.819779 24.789 0.638418 24.8919 0.48437 25.0288C0.330321 25.1656 0.20707 25.3334 0.122707 25.5211L0.114866 25.5387C0.110162 25.55 0.105458 25.5613 0.101145 25.5727C0.0968329 25.584 0.0921285 25.5949 0.0878162 25.6063C0.0835038 25.6176 0.0823277 25.6219 0.0795835 25.6297C0.074095 25.6449 0.0689986 25.6602 0.0639021 25.6754L0.0591977 25.6906C0.0537093 25.709 0.0482208 25.7277 0.0431243 25.7465L0.0411642 25.7547C0.0356757 25.7762 0.0305793 25.7977 0.0262669 25.8195C0.0168581 25.8659 0.00967081 25.9129 0.00470505 25.9605V33.0168C0.00470505 33.5431 0.214526 34.0478 0.588011 34.42C0.961495 34.7921 1.46805 35.0012 1.99624 35.0012H38.0002L38.0037 34.9973C38.5314 34.9965 39.0373 34.7872 39.4102 34.4151C39.7831 34.043 39.9925 33.5387 39.9925 33.0129V32.9895H39.9945V26.0191C39.9945 26.002 39.9921 25.9852 39.9906 25.968C39.961 25.6833 39.8479 25.4136 39.6654 25.1927C39.4828 24.9717 39.2389 24.8093 38.9642 24.7258C38.9101 24.7137 38.8564 24.7008 38.8031 24.6867C37.7716 24.4167 36.8578 23.8161 36.2026 22.9776C35.5474 22.1391 35.1872 21.1091 35.1773 20.0465C35.1675 18.9838 35.5087 17.9475 36.1483 17.0971C36.788 16.2467 37.6905 15.6295 38.7168 15.3406C39.0455 15.3014 39.351 15.1518 39.5831 14.9166C39.8151 14.6813 39.9598 14.3743 39.9933 14.0461C39.998 13.9966 40.0003 13.947 40 13.8973Z" fill="#66DAFF"/>
                    <mask id="mask0_10257_93473" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="5" width="40" height="31">
                      <path d="M40 13.8973C40 13.8476 39.9975 13.7979 39.9925 13.7484V7.02305L39.9902 7.0207V6.98711C39.9902 6.72652 39.9387 6.46848 39.8386 6.22772C39.7385 5.98697 39.5918 5.76821 39.4069 5.58394C39.2219 5.39968 39.0024 5.25351 38.7608 5.15379C38.5191 5.05406 38.2602 5.00273 37.9986 5.00273H37.9896L37.9873 5H2.02603L2.01897 5.00664H1.99663C1.47027 5.00663 0.965314 5.21425 0.592132 5.58412C0.21895 5.95398 0.00789466 6.45601 0.00509708 6.98047V13.7719C0.00196082 13.8109 6.52257e-07 13.85 6.52257e-07 13.8891C-0.000331262 14.2397 0.126023 14.5787 0.355951 14.8441C0.585878 15.1095 0.904011 15.2835 1.25216 15.3344C2.27455 15.6188 3.17539 16.2289 3.8171 17.0715C4.45881 17.914 4.8061 18.9427 4.80594 20.0004C4.80606 21.0676 4.45262 22.105 3.80046 22.9516C3.14831 23.7982 2.23392 24.4066 1.19923 24.6824C1.13886 24.6984 1.0777 24.7133 1.01654 24.727C0.819779 24.789 0.638418 24.8919 0.48437 25.0288C0.330321 25.1656 0.20707 25.3334 0.122707 25.5211L0.114866 25.5387C0.110162 25.55 0.105458 25.5613 0.101145 25.5727C0.0968329 25.584 0.0921285 25.5949 0.0878162 25.6063C0.0835038 25.6176 0.0823277 25.6219 0.0795835 25.6297C0.074095 25.6449 0.0689986 25.6602 0.0639021 25.6754L0.0591977 25.6906C0.0537093 25.709 0.0482208 25.7277 0.0431243 25.7465L0.0411642 25.7547C0.0356757 25.7762 0.0305793 25.7977 0.0262669 25.8195C0.0168581 25.8659 0.00967081 25.9129 0.00470505 25.9605V33.0168C0.00470505 33.5431 0.214526 34.0478 0.588011 34.42C0.961495 34.7921 1.46805 35.0012 1.99624 35.0012H38.0002L38.0037 34.9973C38.5314 34.9965 39.0373 34.7872 39.4102 34.4151C39.7831 34.043 39.9925 33.5387 39.9925 33.0129V32.9895H39.9945V26.0191C39.9945 26.002 39.9921 25.9852 39.9906 25.968C39.961 25.6833 39.8479 25.4136 39.6654 25.1927C39.4828 24.9717 39.2389 24.8093 38.9642 24.7258C38.9101 24.7137 38.8564 24.7008 38.8031 24.6867C37.7716 24.4167 36.8578 23.8161 36.2026 22.9776C35.5474 22.1391 35.1872 21.1091 35.1773 20.0465C35.1675 18.9838 35.5087 17.9475 36.1483 17.0971C36.788 16.2467 37.6905 15.6295 38.7168 15.3406C39.0455 15.3014 39.351 15.1518 39.5831 14.9166C39.8151 14.6813 39.9598 14.3743 39.9933 14.0461C39.998 13.9966 40.0003 13.947 40 13.8973Z" fill="#66DAFF"/>
                    </mask>
                    <g mask="url(#mask0_10257_93473)">
                      <circle opacity="0.3" cx="5" cy="11" r="11" fill="white"/>
                      <circle opacity="0.2" cx="5" cy="11" r="20" fill="white"/>
                    </g>
                    <path d="M39.3 13.9015L39.3 13.8967C39.3 13.8707 39.2987 13.8448 39.2961 13.8189L39.2925 13.7838V13.7484V7.31354L39.2902 7.31119V7.0207V6.98711C39.2902 6.81879 39.2569 6.65206 39.1922 6.49643L39.8386 6.22772L39.1922 6.49642C39.1275 6.34078 39.0326 6.19919 38.9128 6.07981C38.793 5.96042 38.6506 5.86559 38.4937 5.80084C38.3368 5.73609 38.1686 5.70273 37.9986 5.70273H37.9896H37.6682L37.6658 5.7H2.3036L2.29655 5.70664H2.01897H1.99663H1.99662C1.65446 5.70664 1.32672 5.84162 1.08489 6.0813C0.843547 6.3205 0.70734 6.6445 0.705097 6.98254V13.7719V13.7999L0.702852 13.8279C0.700809 13.8533 0.700001 13.8731 0.700001 13.8891V13.8897C0.699828 14.0714 0.765297 14.2475 0.885014 14.3857L0.360121 14.8405L0.885015 14.3857C1.00478 14.524 1.17094 14.6151 1.35335 14.6417L1.39715 14.6481L1.43979 14.66C2.60894 14.9853 3.63957 15.6831 4.37398 16.6473C5.10838 17.6116 5.50608 18.7892 5.50594 20.0003L39.3 13.9015ZM39.3 13.9015C39.3001 13.9267 39.299 13.952 39.2967 13.9771M39.3 13.9015L39.2967 13.9771M1.37952 25.3588L1.37872 25.359C1.32047 25.3745 1.2621 25.3888 1.20415 25.4022C1.11014 25.4351 1.02356 25.4861 0.949299 25.5521C0.869236 25.6232 0.805307 25.7102 0.761531 25.8073C0.761413 25.8075 0.761294 25.8078 0.761176 25.8081L0.758122 25.8149L0.756295 25.8194C0.755683 25.8209 0.755363 25.8217 0.755258 25.8219C0.750421 25.8346 0.745752 25.8461 0.743692 25.8512L0.743301 25.8522C0.743247 25.8523 0.743195 25.8525 0.743143 25.8526L0.740024 25.8617L0.738167 25.867L0.738146 25.867C0.736226 25.8723 0.734123 25.8784 0.730296 25.8898L0.729873 25.8911L1.37952 25.3588ZM1.37952 25.3588C2.56265 25.0434 3.60869 24.3476 4.355 23.3788C5.10131 22.41 5.50604 21.2225 5.50594 20.0005L1.37952 25.3588ZM38.6246 25.3636C38.6774 25.3775 38.7295 25.3902 38.7808 25.402C38.9159 25.4472 39.0354 25.5292 39.1257 25.6385C39.2205 25.7532 39.279 25.893 39.2943 26.0402L39.2945 26.042V32.2895H39.2925V32.9895V33.0129C39.2925 33.3524 39.1573 33.6786 38.9158 33.9196C38.6741 34.1607 38.3458 34.2968 38.0028 34.2973L37.6925 34.2977L37.6893 34.3012H1.99624C1.65289 34.3012 1.32411 34.1652 1.08209 33.9241C0.840162 33.683 0.704705 33.3566 0.704705 33.0168V26.0026C0.706839 25.9877 0.709371 25.9731 0.712289 25.9588L0.713047 25.9549C0.714007 25.9501 0.715786 25.942 0.719383 25.9279L0.719465 25.928L0.721088 25.9212C0.723277 25.9134 0.725858 25.9046 0.728995 25.8941L39.2965 13.9793C39.2966 13.9786 39.2966 13.9778 39.2967 13.9771M38.6246 25.3636L38.8031 24.6867L38.6258 25.3639C38.6254 25.3638 38.625 25.3637 38.6246 25.3636ZM38.6246 25.3636C37.4455 25.0546 36.4006 24.3679 35.651 23.4086C34.9012 22.4489 34.4886 21.2698 34.4774 20.053C34.4661 18.8361 34.8569 17.6496 35.5889 16.6763C36.3209 15.7031 37.3535 14.9972 38.5272 14.6668L38.5797 14.652L38.6339 14.6456C38.8054 14.6251 38.9642 14.5471 39.0846 14.4251C39.2044 14.3036 39.279 14.1456 39.2967 13.9771M39.4971 26.0191L39.9906 25.968L39.2949 26.0401L39.4971 26.0191Z" stroke="#32B9E4" stroke-width="1.4"/>
                    <rect opacity="0.9" x="14" y="13" width="4" height="2" rx="1" fill="white"/>
                    <rect opacity="0.9" x="14" y="19" width="4" height="2" rx="1" fill="white"/>
                    <rect opacity="0.9" x="14" y="25" width="4" height="2" rx="1" fill="white"/>
                    <rect opacity="0.9" x="20" y="13" width="12" height="2" rx="1" fill="white"/>
                    <rect opacity="0.9" x="20" y="19" width="12" height="2" rx="1" fill="white"/>
                    <rect opacity="0.9" x="20" y="25" width="12" height="2" rx="1" fill="white"/>
                    <line x1="10.7" y1="7" x2="10.7" y2="33" stroke="#32B9E4" stroke-width="1.4" stroke-dasharray="2.8 2.8"/>
                  </svg> -->
									<img
										style="width: 40px"
										src="../assets/add-sell-invoice.png"
										alt=""
									/>
									<p
										class="btn-box-menu-item-title"
										v-if="contractType == 'sell'"
										@click="goAddInvoice('OUTPUT')"
									>
										新增销项发票
									</p>
									<p
										class="btn-box-menu-item-title"
										v-else
										@click="goAddInvoice('INPUT')"
									>
										新增进项发票
									</p>
								</div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
								>
									<path
										d="M5 3L9 7L5 11"
										stroke="#C1C1C1"
										stroke-opacity="0.8"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
							<div class="btn-box-menu-item">
								<div style="display: flex; align-items: center">
									<!-- <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M40 13.8973C40 13.8476 39.9975 13.7979 39.9925 13.7484V7.02305L39.9902 7.0207V6.98711C39.9902 6.72652 39.9387 6.46848 39.8386 6.22772C39.7385 5.98697 39.5918 5.76821 39.4069 5.58394C39.2219 5.39968 39.0024 5.25351 38.7608 5.15379C38.5191 5.05406 38.2602 5.00273 37.9986 5.00273H37.9896L37.9873 5H2.02603L2.01897 5.00664H1.99663C1.47027 5.00663 0.965314 5.21425 0.592132 5.58412C0.21895 5.95398 0.00789466 6.45601 0.00509708 6.98047V13.7719C0.00196082 13.8109 6.52257e-07 13.85 6.52257e-07 13.8891C-0.000331262 14.2397 0.126023 14.5787 0.355951 14.8441C0.585878 15.1095 0.904011 15.2835 1.25216 15.3344C2.27455 15.6188 3.17539 16.2289 3.8171 17.0715C4.45881 17.914 4.8061 18.9427 4.80594 20.0004C4.80606 21.0676 4.45262 22.105 3.80046 22.9516C3.14831 23.7982 2.23392 24.4066 1.19923 24.6824C1.13886 24.6984 1.0777 24.7133 1.01654 24.727C0.819779 24.789 0.638418 24.8919 0.48437 25.0288C0.330321 25.1656 0.20707 25.3334 0.122707 25.5211L0.114866 25.5387C0.110162 25.55 0.105458 25.5613 0.101145 25.5727C0.0968329 25.584 0.0921285 25.5949 0.0878162 25.6063C0.0835038 25.6176 0.0823277 25.6219 0.0795835 25.6297C0.074095 25.6449 0.0689986 25.6602 0.0639021 25.6754L0.0591977 25.6906C0.0537093 25.709 0.0482208 25.7277 0.0431243 25.7465L0.0411642 25.7547C0.0356757 25.7762 0.0305793 25.7977 0.0262669 25.8195C0.0168581 25.8659 0.00967081 25.9129 0.00470505 25.9605V33.0168C0.00470505 33.5431 0.214526 34.0478 0.588011 34.42C0.961495 34.7921 1.46805 35.0012 1.99624 35.0012H38.0002L38.0037 34.9973C38.5314 34.9965 39.0373 34.7872 39.4102 34.4151C39.7831 34.043 39.9925 33.5387 39.9925 33.0129V32.9895H39.9945V26.0191C39.9945 26.002 39.9921 25.9852 39.9906 25.968C39.961 25.6833 39.8479 25.4136 39.6654 25.1927C39.4828 24.9717 39.2389 24.8093 38.9642 24.7258C38.9101 24.7137 38.8564 24.7008 38.8031 24.6867C37.7716 24.4167 36.8578 23.8161 36.2026 22.9776C35.5474 22.1391 35.1872 21.1091 35.1773 20.0465C35.1675 18.9838 35.5087 17.9475 36.1483 17.0971C36.788 16.2467 37.6905 15.6295 38.7168 15.3406C39.0455 15.3014 39.351 15.1518 39.5831 14.9166C39.8151 14.6813 39.9598 14.3743 39.9933 14.0461C39.998 13.9966 40.0003 13.947 40 13.8973Z" fill="#898EFB"/>
                    <mask id="mask0_10257_93487" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="5" width="40" height="31">
                    <path d="M40 13.8973C40 13.8476 39.9975 13.7979 39.9925 13.7484V7.02305L39.9902 7.0207V6.98711C39.9902 6.72652 39.9387 6.46848 39.8386 6.22772C39.7385 5.98697 39.5918 5.76821 39.4069 5.58394C39.2219 5.39968 39.0024 5.25351 38.7608 5.15379C38.5191 5.05406 38.2602 5.00273 37.9986 5.00273H37.9896L37.9873 5H2.02603L2.01897 5.00664H1.99663C1.47027 5.00663 0.965314 5.21425 0.592132 5.58412C0.21895 5.95398 0.00789466 6.45601 0.00509708 6.98047V13.7719C0.00196082 13.8109 6.52257e-07 13.85 6.52257e-07 13.8891C-0.000331262 14.2397 0.126023 14.5787 0.355951 14.8441C0.585878 15.1095 0.904011 15.2835 1.25216 15.3344C2.27455 15.6188 3.17539 16.2289 3.8171 17.0715C4.45881 17.914 4.8061 18.9427 4.80594 20.0004C4.80606 21.0676 4.45262 22.105 3.80046 22.9516C3.14831 23.7982 2.23392 24.4066 1.19923 24.6824C1.13886 24.6984 1.0777 24.7133 1.01654 24.727C0.819779 24.789 0.638418 24.8919 0.48437 25.0288C0.330321 25.1656 0.20707 25.3334 0.122707 25.5211L0.114866 25.5387C0.110162 25.55 0.105458 25.5613 0.101145 25.5727C0.0968329 25.584 0.0921285 25.5949 0.0878162 25.6063C0.0835038 25.6176 0.0823277 25.6219 0.0795835 25.6297C0.074095 25.6449 0.0689986 25.6602 0.0639021 25.6754L0.0591977 25.6906C0.0537093 25.709 0.0482208 25.7277 0.0431243 25.7465L0.0411642 25.7547C0.0356757 25.7762 0.0305793 25.7977 0.0262669 25.8195C0.0168581 25.8659 0.00967081 25.9129 0.00470505 25.9605V33.0168C0.00470505 33.5431 0.214526 34.0478 0.588011 34.42C0.961495 34.7921 1.46805 35.0012 1.99624 35.0012H38.0002L38.0037 34.9973C38.5314 34.9965 39.0373 34.7872 39.4102 34.4151C39.7831 34.043 39.9925 33.5387 39.9925 33.0129V32.9895H39.9945V26.0191C39.9945 26.002 39.9921 25.9852 39.9906 25.968C39.961 25.6833 39.8479 25.4136 39.6654 25.1927C39.4828 24.9717 39.2389 24.8093 38.9642 24.7258C38.9101 24.7137 38.8564 24.7008 38.8031 24.6867C37.7716 24.4167 36.8578 23.8161 36.2026 22.9776C35.5474 22.1391 35.1872 21.1091 35.1773 20.0465C35.1675 18.9838 35.5087 17.9475 36.1483 17.0971C36.788 16.2467 37.6905 15.6295 38.7168 15.3406C39.0455 15.3014 39.351 15.1518 39.5831 14.9166C39.8151 14.6813 39.9598 14.3743 39.9933 14.0461C39.998 13.9966 40.0003 13.947 40 13.8973Z" fill="#66DAFF"/>
                    </mask>
                    <g mask="url(#mask0_10257_93487)">
                    <circle opacity="0.3" cx="5" cy="11" r="11" fill="white"/>
                    <circle opacity="0.2" cx="5" cy="11" r="20" fill="white"/>
                    </g>
                    <line x1="10.7" y1="7" x2="10.7" y2="33" stroke="#6B6FE0" stroke-width="1.4" stroke-dasharray="2.8 2.8"/>
                    <path d="M39.3 13.9015L39.3 13.8967C39.3 13.8707 39.2987 13.8448 39.2961 13.8189L39.2925 13.7838V13.7484V7.31354L39.2902 7.31119V7.0207V6.98711C39.2902 6.81879 39.2569 6.65206 39.1922 6.49643L39.8386 6.22772L39.1922 6.49642C39.1275 6.34078 39.0326 6.19919 38.9128 6.07981C38.793 5.96042 38.6506 5.86559 38.4937 5.80084C38.3368 5.73609 38.1686 5.70273 37.9986 5.70273H37.9896H37.6682L37.6658 5.7H2.3036L2.29655 5.70664H2.01897H1.99663H1.99662C1.65446 5.70664 1.32672 5.84162 1.08489 6.0813C0.843547 6.3205 0.70734 6.6445 0.705097 6.98254V13.7719V13.7999L0.702852 13.8279C0.700809 13.8533 0.700001 13.8731 0.700001 13.8891V13.8897C0.699828 14.0714 0.765297 14.2475 0.885014 14.3857L0.360121 14.8405L0.885015 14.3857C1.00478 14.524 1.17094 14.6151 1.35335 14.6417L1.39715 14.6481L1.43979 14.66C2.60894 14.9853 3.63957 15.6831 4.37398 16.6473C5.10838 17.6116 5.50608 18.7892 5.50594 20.0003L39.3 13.9015ZM39.3 13.9015C39.3001 13.9267 39.299 13.952 39.2967 13.9771M39.3 13.9015L39.2967 13.9771M1.37952 25.3588L1.37872 25.359C1.32047 25.3745 1.2621 25.3888 1.20415 25.4022C1.11014 25.4351 1.02356 25.4861 0.949299 25.5521C0.869236 25.6232 0.805307 25.7102 0.761531 25.8073C0.761413 25.8075 0.761294 25.8078 0.761176 25.8081L0.758122 25.8149L0.756295 25.8194C0.755683 25.8209 0.755363 25.8217 0.755258 25.8219C0.750421 25.8346 0.745752 25.8461 0.743692 25.8512L0.743301 25.8522C0.743247 25.8523 0.743195 25.8525 0.743143 25.8526L0.740024 25.8617L0.738167 25.867L0.738146 25.867C0.736226 25.8723 0.734123 25.8784 0.730296 25.8898L0.729873 25.8911L1.37952 25.3588ZM1.37952 25.3588C2.56265 25.0434 3.60869 24.3476 4.355 23.3788C5.10131 22.41 5.50604 21.2225 5.50594 20.0005L1.37952 25.3588ZM38.6246 25.3636C38.6774 25.3775 38.7295 25.3902 38.7808 25.402C38.9159 25.4472 39.0354 25.5292 39.1257 25.6385C39.2205 25.7532 39.279 25.893 39.2943 26.0402L39.2945 26.042V32.2895H39.2925V32.9895V33.0129C39.2925 33.3524 39.1573 33.6786 38.9158 33.9196C38.6741 34.1607 38.3458 34.2968 38.0028 34.2973L37.6925 34.2977L37.6893 34.3012H1.99624C1.65289 34.3012 1.32411 34.1652 1.08209 33.9241C0.840162 33.683 0.704705 33.3566 0.704705 33.0168V26.0026C0.706839 25.9877 0.709371 25.9731 0.712289 25.9588L0.713047 25.9549C0.714007 25.9501 0.715786 25.942 0.719383 25.9279L0.719465 25.928L0.721088 25.9212C0.723277 25.9134 0.725858 25.9046 0.728995 25.8941L39.2965 13.9793C39.2966 13.9786 39.2966 13.9778 39.2967 13.9771M38.6246 25.3636L38.8031 24.6867L38.6258 25.3639C38.6254 25.3638 38.625 25.3637 38.6246 25.3636ZM38.6246 25.3636C37.4455 25.0546 36.4006 24.3679 35.651 23.4086C34.9012 22.4489 34.4886 21.2698 34.4774 20.053C34.4661 18.8361 34.8569 17.6496 35.5889 16.6763C36.3209 15.7031 37.3535 14.9972 38.5272 14.6668L38.5797 14.652L38.6339 14.6456C38.8054 14.6251 38.9642 14.5471 39.0846 14.4251C39.2044 14.3036 39.279 14.1456 39.2967 13.9771M39.4971 26.0191L39.9906 25.968L39.2949 26.0401L39.4971 26.0191Z" stroke="#6B6FE0" stroke-width="1.4"/>
                    <path opacity="0.9" d="M21.5 15.3906H17.3112L15 19.1406V24C15 24.5523 15.4477 25 16 25H29.6754C30.2277 25 30.6754 24.5523 30.6754 24V14C30.6754 13.4477 30.2277 13 29.6754 13H23.1752C22.6229 13 22.1752 13.4477 22.1752 14V19.3723C22.1752 19.9246 21.7275 20.3723 21.1752 20.3723H18.5" stroke="white" stroke-width="1.4" stroke-linecap="round"/>
                    <circle opacity="0.9" cx="1" cy="1" r="1.7" transform="matrix(-1 0 0 1 20 24)" fill="#9699F0" stroke="white" stroke-width="1.4"/>
                    <circle opacity="0.9" cx="1" cy="1" r="1.7" transform="matrix(-1 0 0 1 28 24)" fill="#9699F0" stroke="white" stroke-width="1.4"/>
                  </svg> -->
									<img
										style="width: 40px"
										src="../assets/add-freight-invoice.png"
										alt=""
									/>
									<p
										class="btn-box-menu-item-title"
										@click="goAddInvoice('DELIVER')"
									>
										新增运费发票
									</p>
								</div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="14"
									height="14"
									viewBox="0 0 14 14"
									fill="none"
								>
									<path
										d="M5 3L9 7L5 11"
										stroke="#C1C1C1"
										stroke-opacity="0.8"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</div>
						</div>
					</template>
					<div class="btn-box-title">新增发票</div>
				</a-tooltip>
			</div>
		</a-tabs>
		<div class="search-box">
			<div
				class="search-box-item"
				:class="{ active: isHasAttachment === item.value }"
				@click="changeSearch(item)"
				v-for="item in searchList"
				:key="item.value"
			>
				{{ item.label }}
			</div>
		</div>
		<!-- 销项发票 和 进项发票 -->
		<div
			class="table-box"
			v-if="tab == 'income'"
		>
			<a-table
				:columns="incomeColumns"
				class="new-table"
				:bordered="false"
				rowKey="no"
				:scroll="{ x: 400 }"
				:dataSource="incomeList"
				:pagination="false"
			>
				<template
					slot="fileUrl"
					slot-scope="text, items"
				>
					<a
						href="javascript:;"
						v-if="items.fileName"
						@click="handlePreview(items)"
						>{{ items.fileName }}</a
					>
				</template>
				<template
					slot="action"
					slot-scope="text, items"
				>
					<a-space :size="20">
						<a
							href="javascript:;"
							v-if="!isBank"
							@click="goInvoiceDetail('detail', items)"
							>详情</a
						>
						<a
							href="javascript:;"
							v-if="items.upLoadAttachButtonShow && !isBank && type == 'rest'"
							@click="goInvoiceDetail('modify', items)"
							>上传附件</a
						>
					</a-space>
				</template>
			</a-table>
		</div>
		<!-- 运费发票 -->
		<div
			class="table-box"
			v-if="tab == 'freight'"
		>
			<a-table
				:columns="freightColumns"
				class="new-table"
				:bordered="false"
				rowKey="no"
				:scroll="{ x: 400 }"
				:dataSource="freightList"
				:pagination="false"
			>
				<span slot="customTitle2">
					开具金额(元)
					<a-tooltip>
						<template slot="title"> 不含税 </template>
						<a-icon
							type="question-circle"
							style="font-size: 12px"
						/>
						<!-- <i class="iconfont icon-liebiaobiaotou-shuoming" style="font-size: 12px"></i> -->
					</a-tooltip>
				</span>
				<template
					slot="fileUrl"
					slot-scope="text, items"
				>
					<a
						href="javascript:;"
						v-if="items.fileName"
						@click="handlePreview(items)"
						>{{ items.fileName }}</a
					>
				</template>

				<template
					slot="action"
					slot-scope="text, items"
				>
					<a
						href="javascript:;"
						v-if="!isBank"
						@click="goInvoiceDetail('detail', items)"
						>详情</a
					>
					<a
						href="javascript:;"
						style="margin-left: 20px"
						v-if="items.upLoadAttachButtonShow && !isBank && type == 'rest'"
						@click="goInvoiceDetail('modify', items)"
						>上传附件</a
					>
				</template>
			</a-table>
		</div>
		<i-pagination
			:pagination="pagination"
			@change="toPage"
		/>
	</div>
</template>

<script>
import iPagination from '@sub/components/iPagination';
import { formatMoney } from '@sub/filters';
import { getPopupContainer } from '@sub//utils/factory.js';
//进项table colums
const incomeColumns = [
	{ title: '发票代码', dataIndex: 'code', width: 150 },
	{ title: '发票号码', dataIndex: 'no', width: 150 },
	{ title: '开票日期', dataIndex: 'issuedDate', width: 150 },
	{ title: '不含税金额(元)', dataIndex: 'taxExcludedAmount', width: 150, customRender: t => formatMoney(t) },
	{ title: '税额(元)', dataIndex: 'taxAmount', width: 100, customRender: t => formatMoney(t) },
	{ title: '价税合计(元)', dataIndex: 'totalAmount', width: 150, customRender: t => formatMoney(t) },
	{ title: '拆分到本合同金额(元)', dataIndex: 'currentContractSplitedAmount', width: 200, customRender: t => formatMoney(t) },
	{ title: '发票附件', dataIndex: 'fileUrl', width: 200, scopedSlots: { customRender: 'fileUrl' } },
	{ title: '发票状态', dataIndex: 'stateName', width: 120 },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 150, fixed: 'right' }
];
// 运费
const freightColumns = [
	{ title: '发票代码', dataIndex: 'code', width: 150 },
	{ title: '发票号码', dataIndex: 'no', width: 150 },
	{ title: '开票日期', dataIndex: 'issuedDate', width: 150 },
	// 开具金额
	{ dataIndex: 'taxExcludedAmount', slots: { title: 'customTitle2' }, width: 150 },
	{ title: '价税合计(元)', dataIndex: 'totalAmount', width: 120, customRender: t => formatMoney(t) },
	{
		title: '是否包含印花税',
		dataIndex: 'stampTaxFlag',
		width: 160,
		customRender: text => {
			return text == 1 ? '否' : '是';
		}
	},
	{
		title: '印花税税额(元)',
		dataIndex: 'stampTaxFlagAmount',
		width: 160,
		customRender: text => {
			return `￥${formatMoney(+text)}`;
		}
	},
	{
		title: '含印花税合计(元)',
		dataIndex: 'stampTaxFlagTotalAmount',
		width: 160,
		customRender: text => {
			return `￥${formatMoney(+text)}`;
		}
	},
	{ title: '拆分到本合同金额(元)', dataIndex: 'currentContractSplitedAmount', width: 200, customRender: t => formatMoney(t) },
	{ title: '发票附件', dataIndex: 'fileUrl', width: 200, scopedSlots: { customRender: 'fileUrl' } },
	{ title: '发票状态', dataIndex: 'stateName', width: 120 },
	{ title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, width: 150, fixed: 'right' }
];
const pathCoalInfo = {
	// 进项
	INPUT: {
		detail: '/center/invoice/buy/detail',
		modify: '/center/invoice/buy/edit'
	},
	// 销项
	OUTPUT: {
		detail: '/center/invoice/sell/detail',
		modify: '/center/invoice/sell/edit'
	},
	// 运费
	DELIVER: {
		detail: '/center/invoice/freight/detail',
		modify: '/center/invoice/freight/edit'
	}
};
export default {
	props: {
		// 运费发票 和 销项发票接口
		getUpstreamTransInvoiceList: {},
		getUpstreamTradeInvoiceList: {},
		getDownstreamTransInvoiceList: {},
		getDownstreamTradeInvoiceList: {},
		getTransInvoiceList: {},
		getInvoiceNumCount: {},
		// 合同类型
		contractType: {
			default: 'buy'
		},
		// 登录的企业信息
		VUEX_ST_COMPANYSUER: {
			default: () => {
				return {
					roles: []
				};
			}
		},
		// 当前的合同信息
		contractInfo: {
			default: () => {
				return {};
			}
		},
		// 金融机构
		isBank: {
			default: false
		},
		type: {
			default: 'rest'
		}
	},
	data() {
		return {
			tab: 'income',
			incomeColumns,
			freightColumns,
			getPopupContainer,
			pagination: {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			},
			// 贸易发票
			incomeList: [],
			// 运费发票
			freightList: [],
			searchList: [
				{ value: 'All', label: '全部' },
				{ value: '1', label: '有附件' },
				{ value: '2', label: '无附件' }
			],
			isHasAttachment: 'All',
			// 发票数量
			invoiceNum: {
				// 贸易发票统计
				tradeNumCount: 0,
				// 运费发票统计
				transNumCount: 0
			}
		};
	},
	computed: {
		// 附件查询参数
		searchParams() {
			if (this.isHasAttachment == 'All') {
				return {
					hasAttach: true,
					noAttach: true
				};
			}
			if (this.isHasAttachment == '1') {
				return {
					hasAttach: true,
					noAttach: false
				};
			}
			return {
				hasAttach: false,
				noAttach: true
			};
		},
		// 采购电子 采购线下 展示的tab  是进项发票
		// 销售线下  销售电子 展示的发票 是销项发票
		// 运输合同 只展示运费发票
		incomeLabel() {
			if (this.contractType == 'sell') {
				if (this.invoiceNum.tradeNumCount) {
					return `销项发票(${this.invoiceNum.tradeNumCount})`;
				}
				return '销项发票';
			}
			if (this.invoiceNum.tradeNumCount) {
				return `进项发票(${this.invoiceNum.tradeNumCount})`;
			}
			return '进项发票';
		},
		freightLabel() {
			if (this.invoiceNum.transNumCount) {
				return `运费发票(${this.invoiceNum.transNumCount})`;
			}
			return `运费发票`;
		},
		// 发票类型
		// eslint-disable-line no-alert
		invoiceType() {
			if (this.contractType == 'sell') {
				if (this.tab == 'income') {
					return 'OUTPUT';
				}
			}
			if (this.tab == 'income') {
				return 'INPUT';
			}
			if (this.tab == 'freight') {
				return 'DELIVER';
			}
			return 'OUTPUT';
		},
		// 是否展示贸易tab
		isShowIncome() {
			// 运输合同 只有运费发票 优先判断
			if (this.contractType == 'trans') {
				return false;
			}
			if (!this.invoiceNum.tradeNumCount && !this.invoiceNum.transNumCount) {
				return true;
			}
			if (!this.invoiceNum.tradeNumCount) {
				return false;
			}

			return true;
		},
		// 运费发票
		isShowFreight() {
			// 运输合同 只有运费发票 优先判断
			if (this.contractType == 'trans') {
				return true;
			}
			if (!this.invoiceNum.tradeNumCount && !this.invoiceNum.transNumCount) {
				return false;
			}
			if (!this.invoiceNum.transNumCount) {
				return false;
			}

			return true;
		},
		// 新增发票按钮权限
		isRoleAuth() {
			// 当合同状态为“执行中”且当前用户为企业管理员、业务员时
			return (
				this.VUEX_ST_COMPANYSUER?.roles?.some(el => ['ADMIN', 'OPERATOR'].includes(el)) &&
				['EXECUTING'].includes(this.contractInfo.status)
			);
		}
	},
	async mounted() {
		await this.getNum();
		// 运输合同 只有运费发票
		if (this.contractType == 'trans') {
			this.tab = 'freight';
			this.getTransList();
		} else if (this.isShowIncome) {
			this.tab = 'income';
			this.getTradeList();
		} else if (!this.isShowIncome) {
			this.tab = 'freight';
			this.getTransList();
		}
	},
	methods: {
		toPage(pageNo = this.pagination.pageNo, pageSize = this.pagination.pageSize) {
			this.pagination.pageNo = pageNo;
			this.pagination.pageSize = pageSize;
			if (this.tab == 'income') {
				this.getTradeList();
			} else {
				this.getTransList();
			}
		},
		changeTab() {
			this.isHasAttachment = 'All';
			// 重置数据
			this.pagination = {
				total: 0, // 总条数
				pageNo: 1,
				pageSize: 10
			};
			if (this.tab == 'income') {
				this.incomeList = [];
				this.getTradeList();
			} else {
				this.freightList = [];
				this.getTransList();
			}
		},
		// 获取销项发票 既 贸易发票
		async getTradeList() {
			let Fn = this.getUpstreamTradeInvoiceList;
			if (this.contractType == 'sell') {
				Fn = this.getDownstreamTradeInvoiceList;
			}
			const params = {
				...this.pagination,
				businessLineNo: this.$route.query.businessLineNo,
				...this.searchParams,
				...this.$route.query
			};
			if (this.contractType == 'trans') {
				this.incomeList = [];
				return;
			}
			const res = await Fn(params);
			this.incomeList = res.data.records || [];
			this.pagination.total = res.data.total || 0;
		},

		// 获取运费发票
		async getTransList() {
			let Fn = this.getUpstreamTransInvoiceList;
			if (this.contractType == 'sell') {
				Fn = this.getDownstreamTransInvoiceList;
			}
			if (this.contractType == 'trans') {
				Fn = this.getTransInvoiceList;
			}
			const params = {
				...this.pagination,
				businessLineNo: this.$route.query.businessLineNo,
				...this.searchParams,
				...this.$route.query
			};
			const res = await Fn(params);
			this.freightList = res.data.records || [];
			this.pagination.total = res.data.total || 0;
		},
		// 获取发票数量
		async getNum() {
			const typeInfo = {
				buy: 'UP_STREAM',
				sell: 'DOWN_STREAM',
				trans: 'TRANS_CONTRACT'
			};
			const params = {
				businessLineNo: this.$route.query.businessLineNo,
				businessLineDataType: typeInfo[this.contractType],
				...this.$route.query
			};

			const res = await this.getInvoiceNumCount(params);
			this.invoiceNum = res.data || {
				tradeNumCount: 0,
				// 运费发票统计
				transNumCount: 0
			};
		},

		changeSearch(item) {
			this.isHasAttachment = item.value;
			this.pagination.pageNo = 1;
			this.pagination.pageSize = 10;
			if (this.tab == 'income') {
				this.incomeList = [];
				this.getTradeList();
			} else {
				this.freightList = [];
				this.getTransList();
			}
		},
		// 去往发票详情
		goInvoiceDetail(type, item) {
			if (this.type == 'rest') {
				const pathItem = pathCoalInfo[this.invoiceType];

				const routeData = this.$router.resolve({
					path: pathItem[type],
					query: {
						id: item.id,
						no: item.no,
						type,
						invoiceType: this.invoiceType,
						industryType: 'COAL'
					}
				});
				window.open(routeData.href, '_blank');
			} else {
				let path = `/biz/invoice/detail?id=${item.id}&invoiceType=${this.invoiceType == 'DELIVER' ? 2 : 1}&industryType=COAL`;

				window.open(path, '_blank');
			}
		},
		// 新增发票
		goAddInvoice(type) {
			let path;
			if (type == 'INPUT') {
				path = '/center/invoice/buy/add?type=buy';
			} else if (type == 'OUTPUT') {
				path = '/center/invoice/sell/add?type=sell';
			} else {
				path = '/center/invoice/freight/add?type=freight';
			}
			this.$router.push({
				path,
				query: {
					orderNo: this.contractInfo.orderNo
				}
			});

			// window.open(path)
		},
		handlePreview(item) {
			this.$emit('handlePreview', item.fileUrl, item);
		}
	},
	components: {
		iPagination
	}
};
</script>
<style lang="less" scoped>
@import url('~@sub/style/table-cover.less');
</style>
<style lang="less">
.add-invoice-tooltips {
	z-index: 100;
	.ant-tooltip-arrow {
		display: none;
	}
	.ant-tooltip-inner {
		width: 232px;
		height: 129px;
		border-radius: 4px;
		background-color: #fff;
		box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.13);
		position: relative;
		right: 22px;
		z-index: 1000;
		padding: 0;
	}
}
</style>
<style scoped lang="less">
.goods-info {
	position: relative;
	.status {
		display: inline-block;
		border-radius: 4px;
		background: #c5ecdd;
		padding: 1px 6px;
		color: #3eb384;
		font-family: PingFang SC;
		font-size: 12px;
	}
}
.search-box {
	margin: 20px 0;
	display: flex;
	border-radius: 4px;
	border: 1px solid var(---Line, #e5e6eb);
	padding: 3px 8px;
	width: 320px;
	box-sizing: border-box;
	justify-content: space-around;

	&-item {
		display: flex;
		padding: 1.5px 8px;
		justify-content: space-around;
		align-items: center;
		color: rgba(0, 0, 0, 0.8);
		font-feature-settings:
			'clig' off,
			'liga' off;
		font-family: PingFang SC;
		font-size: 14px;
		border-radius: 2px;
		width: 96px;
		box-sizing: border-box;
		cursor: pointer;
		&.active {
			background: @primary-color;
			color: #fff;
		}
	}
}
.btn-box-menu {
	.btn-box-menu-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		height: 64px;
		padding: 0 3px 0 12px;
		border-radius: 4px;
		line-height: 64px;
		.icon-left {
			width: 40px;
			height: 40px;
		}
		.icon-right {
			width: 14px;
			height: 14px;
			vertical-align: middle;
		}
		.btn-box-menu-item-title {
			font-size: 16px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: rgba(0, 0, 0, 0.8);
			line-height: 22px;
			margin-left: 12px;
		}
		.btn-box-menu-item-tips {
			font-size: 14px;
			font-family:
				PingFangSC-Regular,
				PingFang SC;
			font-weight: 400;
			color: #77889d;
			line-height: 20px;
		}
	}
	.btn-box-menu-item:first-child {
		position: relative;
		& > ::after {
			content: '';
			width: 95%;
			height: 1px;
			background: #e5e6eb;
			position: absolute;
			right: 0px;
			bottom: 0px;
		}
	}
	.btn-box-menu-item.hover {
		background: #e4ebf4;
	}
}
::v-deep .ant-tabs {
	margin-top: 15px;
	overflow: inherit;
}
.btn-box-title {
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 4px;
	background: @primary-color;
	color: #fff;
	text-align: center;
	font-family: PingFang SC;
	font-size: 14px;
	width: 116px;
	height: 32px;
	cursor: pointer;
}
</style>
