export interface EmployeeProfile {
  id: string;
  full_name: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  phone: string;
  personal_email: string;
  national_id: string;
  id_issue_date: string;
  id_issue_place: string;
  permanent_address: string;
  temporary_address: string;
  cccd_front_path: string;
  cccd_back_path: string;
  other_docs_path: string;
  team: string;
  tax_code: string;
  insurance_code: string;
  health_insurance_code: string;
  bank_account: string;
  bank_name_branch: string;
  created_at: string;
  updated_at: string;
}

export function validateEmployeeProfile(body: Partial<EmployeeProfile>): string[] {
  const errors: string[] = [];

  // Basic validation
  if (!body.full_name?.trim()) errors.push("Họ và tên là bắt buộc");
  if (!body.dob?.trim()) errors.push("Ngày sinh là bắt buộc");
  
  if (!body.gender) {
    errors.push("Giới tính là bắt buộc");
  } else if (body.gender !== 'Nam' && body.gender !== 'Nữ') {
    errors.push("Giới tính không hợp lệ");
  }

  if (!body.phone?.trim()) {
    errors.push("Số điện thoại là bắt buộc");
  } else {
    const phoneCleaned = body.phone.replace(/[\s\-().]/g, "");
    if (!/^(0|\+84)\d{9,10}$/.test(phoneCleaned)) {
      errors.push("Số điện thoại không hợp lệ");
    }
  }

  if (!body.personal_email?.trim()) {
    errors.push("Email cá nhân là bắt buộc");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.personal_email.trim())) {
    errors.push("Email cá nhân không hợp lệ");
  }

  // ID & Residence
  if (!body.national_id?.trim()) errors.push("Số CCCD/CMND là bắt buộc");
  if (!body.id_issue_date?.trim()) errors.push("Ngày cấp CCCD/CMND là bắt buộc");
  if (!body.id_issue_place?.trim()) errors.push("Nơi cấp CCCD/CMND là bắt buộc");
  if (!body.permanent_address?.trim()) errors.push("Địa chỉ thường trú là bắt buộc");
  if (!body.temporary_address?.trim()) errors.push("Địa chỉ tạm trú là bắt buộc");

  // CCCD files validation
  if (!body.cccd_front_path?.trim()) {
    errors.push("Ảnh mặt trước CCCD là bắt buộc");
  }
  if (!body.cccd_back_path?.trim()) {
    errors.push("Ảnh mặt sau CCCD là bắt buộc");
  }

  // Insurance & Tax
  if (!body.tax_code?.trim()) errors.push("Mã số thuế cá nhân là bắt buộc");
  if (!body.insurance_code?.trim()) errors.push("Số sổ Bảo hiểm xã hội là bắt buộc");
  if (!body.health_insurance_code?.trim()) errors.push("Mã số thẻ Bảo hiểm y tế là bắt buộc");

  // Bank
  if (!body.bank_account?.trim()) errors.push("Số tài khoản ngân hàng là bắt buộc");
  if (!body.bank_name_branch?.trim()) errors.push("Tên ngân hàng - Chi nhánh mở thẻ là bắt buộc");

  return errors;
}

