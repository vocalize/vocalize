#!/usr/bin/env python

import os
import speechprocessing


if __name__ == '__main__':

    if not os.path.exists('./averaged'):
        os.makedirs('./averaged')
    for dir in os.listdir('./output'):
        standard_path = './output/' + dir + '/standard'

        if os.path.exists(standard_path):
            files = []
            for file in os.listdir(standard_path):
                files.append('./output/' + dir + '/standard/' + file)
            output = './averaged/' + dir + '.wav'
            files.insert(0, output)
            print files
            speechprocessing.average(*files)


            text_list = './averaged/' + dir + '.txt'
            control = output
            
            text_scores = []
            for file in os.listdir(standard_path):
                exp_file = './output/' + dir + '/standard/' + file
                # text_scores.append()
                with open(text_list, "a") as myfile:
                    myfile.write(str(speechprocessing.compare(control, exp_file)))
                    myfile.write('\n')


    # for root, dirs, files in os.walk("./output"):
        # print dirs