import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ThemesService {

    constructor(private prisma: PrismaService) { }


    async getThemes(userid: string) {

        const result = [];
        const id = Number(userid);

        try {

            const themes = await this.prisma.themes.findMany({
                select: {
                    id: true,
                    name: true,
                    image: true,
                }
            });

            const userTheme = await this.prisma.userTheme.findMany({
                where: {
                    userId: id,
                },
            });

            if (userTheme.length > 0) {
                for (let i = 0; i < themes.length; i++) {

                    let selected = false;
                    let id = themes[i].id;
                    let name = themes[i].name;
                    let image = themes[i].image;

                    if (themes[i].id === userTheme[0].themeId) selected = true;

                    result.push({
                        id,
                        name,
                        image,
                        selected
                    });
                }
            }

            else {
                for (let i = 0; i < themes.length; i++) {

                    let selected = false;
                    let id = themes[i].id;
                    let name = themes[i].name;
                    let image = themes[i].image;

                    if (name === "default") selected = true;

                    result.push({
                        id,
                        name,
                        image,
                        selected
                    });
                }
            }
        }
        catch (e) {
            return null;
        }


        return result;
    }

    async selectedTheme(userid: string, themeid: string) {
        
        const id = Number(userid);
        const theme = Number(themeid);

        try {
            const userTheme = await this.prisma.userTheme.findFirst(
                {
                    where: {
                        userId: id,
                    },
                }
            )

            if (userTheme) {
                return await this.prisma.userTheme.update({
                    where: {
                        id: userTheme.id,
                    },
                    data: {
                        themeId: theme,
                    },
                });
            }

            
            return await this.prisma.userTheme.create({
                data: {
                    userId: id,
                    themeId: theme,
                },
            });
            

        }
        catch (e) {
            return null;
        }

    }

}
