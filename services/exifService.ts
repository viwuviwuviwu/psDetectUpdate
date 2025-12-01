// services/exifService.ts
// 这个版本使用 exif-js 库提取 EXIF 数据

import EXIF from 'exif-js'; // 需要安装: npm install exif-js

export const extractExifData = async (file: File): Promise<Record<string, any>> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        try {
          EXIF.getData(img as any, function() {
            const exifData: Record<string, any> = {};
            const allTags = EXIF.getAllTags(this);
            
            // 基本文件信息
            exifData.FileName = file.name;
            exifData.FileSize = `${(file.size / 1024).toFixed(2)} KB`;
            exifData.FileType = file.type;
            
            // 复制所有 EXIF 标签
            for (const [key, value] of Object.entries(allTags)) {
              // 过滤掉二进制数据和过大的字段
              if (key !== "MakerNote" && key !== "UserComment" && 
                  typeof value !== 'object' && value !== undefined) {
                exifData[key] = value;
              }
            }
            
            // 特别处理一些重要的 EXIF 字段
            if (allTags.Make) exifData.Make = allTags.Make;
            if (allTags.Model) exifData.Model = allTags.Model;
            if (allTags.Software) exifData.Software = allTags.Software;
            if (allTags.ModifyDate) exifData.ModifyDate = allTags.ModifyDate;
            if (allTags.DateTimeOriginal) exifData.DateTimeOriginal = allTags.DateTimeOriginal;
            
            // 处理 GPS 信息
            if (allTags.GPSLatitude && allTags.GPSLongitude) {
              const lat = EXIF.getTag(this, "GPSLatitude");
              const lon = EXIF.getTag(this, "GPSLongitude");
              const latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
              const lonRef = EXIF.getTag(this, "GPSLongitudeRef") || "E";
              
              if (lat && lon) {
                // 转换 GPS 坐标为十进制格式
                exifData.GPSLatitude = convertDMSToDD(lat, latRef);
                exifData.GPSLongitude = convertDMSToDD(lon, lonRef);
                exifData.GPSCoordinates = `${exifData.GPSLatitude}, ${exifData.GPSLongitude}`;
              }
            }
            
            resolve(exifData);
          });
        } catch (error) {
          console.error("EXIF 提取错误:", error);
          resolve({ error: "EXIF 数据提取失败" });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve({ error: "文件读取失败" });
    reader.readAsDataURL(file);
  });
};

// 将度分秒格式转换为十进制度数
function convertDMSToDD(dms: number[], ref: string): number {
  let degrees = dms[0];
  let minutes = dms[1];
  let seconds = dms[2];
  
  let dd = degrees + minutes/60 + seconds/3600;
  
  if (ref === "S" || ref === "W") {
    dd = dd * -1;
  }
  
  return parseFloat(dd.toFixed(6));
}

